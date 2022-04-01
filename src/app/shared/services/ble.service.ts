import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {StorageService} from './storage.service';
import {GatewayService} from './gateway.service';
import {InitService} from './init.service';
import {ShootingService} from './shooting.service';
import {BleClient} from '@capacitor-community/bluetooth-le';

const SERVICE_2 = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const SERVICE_2_CHAR = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const SERVICE_2_CHAR_WRITE = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

@Injectable({
    providedIn: 'root'
})
export class BleService {
    msgNumber = 1;
    devices: any[];
    peripheral: any;
    dataFromDevice;
    notifyShotArrived = new BehaviorSubject(0);
    notifyDisconnect = new BehaviorSubject(null);
    notifyTargetConnected = new BehaviorSubject(false);
    subscription: Subscription;
    scanFinished = new BehaviorSubject<any>(false);
    currentTargetId: any;
    isConnectedFlag = false;

    isGateway: boolean;
    gatewayTargets: { gateway: any; target: any };
    notifyResetGateway = new BehaviorSubject(false);
    gateways = [];
    activateReconnectProcessCount = 0;

    constructor(
        private storage: StorageService,
        private ngZone: NgZone,
        private shootingService: ShootingService,
        private initService: InitService,
        private gatewayService: GatewayService) {
        this.devices = this.storage.getItem('ble');
        if (!this.devices) {
            this.devices = [];
        }
    }

    // Scan for BLE devices
    scan() {
        this.devices = [];  // clear list
        this.storage.setItem('ble', this.devices);
        BleClient.requestLEScan(null, result => {
            this.onDeviceDiscovered(result);
        });
        setTimeout(() => {
            this.storage.setItem('ble', this.devices);
            this.scanFinished.next(true);
        }, 6000);
    }

    // When a BLE device is discovered we filter only the known devices.
    onDeviceDiscovered(device) {
        this.ngZone.run(() => {
            if (device.name) {
                console.log('FOUND DEVICE IN BLE SERVICE: ' + device.name);
                if (device.name.toLowerCase().includes('adl') ||
                    device.name.toLowerCase().includes('e64') ||
                    device.name.toLowerCase().includes('e64n015') ||
                    device.name.toLowerCase().includes('e1n') ||
                    device.name.toLowerCase().includes('e1n') ||
                    device.name.toLowerCase().includes('eMarn') ||
                    device.name.toLowerCase().includes('003') ||
                    device.name.toLowerCase().includes('e16') ||
                    device.name.toLowerCase().includes('nordic')) {
                    if (this.devices.length === 0) {
                        this.devices.push(device);
                        this.storage.setItem('ble', this.devices);
                    } else if (this.devices.find(o => o.id === device.id) === undefined) {
                        this.devices.push(device);
                        this.storage.setItem('ble', this.devices);
                    }
                } else if (device.name.toLowerCase().includes('egateway')) {
                    this.gateways.push(device.id);
                    this.isGateway = true;
                    this.initService.isGateway = true;
                    this.connect(device.id);
                }
            }
        });
    }

    // If the connection crashes when it reconnects we reset the stats.
    resetShots() {
        this.gatewayService.initStats();
        // const txe = new TextEncoder();
        // if (this.peripheral && this.peripheral.id) {
        //     this.ble.write(this.peripheral.id, SERVICE_2, SERVICE_2_CHAR_WRITE, txe.encode('CLCO\n').buffer).then((prmise) => {
        //         console.log('From Reset: ' + prmise);
        //     }).catch(err => {
        //     });
        // }
    }

    // NOT ACTIVE. -this was used when we wanted to let the user refresh the connection.
    resetConnection() {
        const txe = new TextEncoder();
        if (this.peripheral && this.peripheral.id) {
            const dv = new DataView(txe.encode('RSTC\n').buffer);
            BleClient.write(this.peripheral.id, SERVICE_2, SERVICE_2_CHAR_WRITE, dv).then((prmise) => {
                console.log('reset connection completed');
            }).catch(err => {
            });
        }
    }

    // If location permission is denied, you'll end up here
    scanError(error) {
        console.log('Error: ' + error);
    }

    getDevices() {
        return this.devices;
    }

    // Sets the target to listen for message from.
    connect(deviceId) {
        if (this.gateways.indexOf(deviceId) > -1) {
            this.isGateway = true;
            this.initService.isGateway = true;
        } else {
            this.resetShots();
        }
        if (this.currentTargetId) {
            BleClient.connect(this.currentTargetId).then((peripheral) => {
                    this.isConnectedFlag = false;
                    this.notifyTargetConnected.next(true);
                    this.onConnected(peripheral);
                },
                peripheral => {
                    console.log('DEVICE DISCONNECT IT SELF', peripheral);
                    this.activatRecconectProcess();
                });
        }

    }

    //  Notify comps that a connection has been made.
    onConnected(peripheral: any) {
        this.isConnectedFlag = false;
        if (!this.isGateway) {
            this.resetShots();
        }
        console.log('Connected to ' + peripheral.name + ' ' + peripheral.id);
        this.ngZone.run(() => {
            this.peripheral = peripheral;
        });
        this.handleRead(peripheral.name, peripheral.id, SERVICE_2, SERVICE_2_CHAR);
    }

    //  Notify comps that a connection has been lost.
    onDeviceDisconnected(peripheral) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DetailPage');
    }

    ionViewWillLeave() {
        console.log('ionViewWillLeave disconnecting Bluetooth');
        BleClient.disconnect(this.peripheral.id).then(
            () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
            () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
        );
    }


    handleRead(name, id, service, characteristic) {
        console.log('SUBSCRIBED TO START NOTIFICATION');
        BleClient.startNotifications(id, service, characteristic, (data) => {
            console.log('RECEIVED A MESSAGE');
            const target = this.storage.getItem('slectedTarget');
            const dec = new TextDecoder();
            const buffer = new Uint8Array(data[0]);
            if (this.isGateway) {
                this.parseGatewayMessage(buffer);
            } else {
                if (dec.decode(buffer) === 'Clear') {
                    console.log('Target cleared shots');
                } else {
                    // @ts-ignore
                    const encoder = new TextEncoder();
                    // @ts-ignore
                    const encodedString = encoder.encode(buffer);
                    // tslint:disable-next-line:radix
                    const text = parseInt(dec.decode(encodedString));
                    this.notifyShotArrived.next(text);
                    this.ngZone.run(() => {
                        console.log('Read from: ' + service + ' ' + service + ' has arrived: ' + text);
                    });
                }
            }
        }).then(r => {
            debugger;
        });
    }

    parseGatewayMessage(buffer: Uint8Array) {
        const selectedTarget = this.shootingService.chosenTarget;
        const target = this.storage.getItem('slectedTarget');
        const messageFromGatewaty = String.fromCharCode.apply(null, buffer);
        console.log('MESSAGE ARRIVED: ' + messageFromGatewaty);
        if (messageFromGatewaty.indexOf(',B,') > -1) {
            this.gatewayService.processData(messageFromGatewaty);
        } else if (selectedTarget && messageFromGatewaty.indexOf('<') > -1 && messageFromGatewaty.indexOf(selectedTarget.name) > -1) {
            this.gatewayService.processData(messageFromGatewaty);
        } else if (messageFromGatewaty.indexOf('Connecting') > -1) {
            this.gatewayTargets = {gateway: this.currentTargetId, target: messageFromGatewaty.split(' ')[3]};
            this.notifyTargetConnected.next(true);
        } else if (messageFromGatewaty.indexOf('Disconnected') > -1) {
            this.activatRecconectProcess();
        }
    }


    isConnected(): Promise<any> {
        return BleClient.isBonded(this.peripheral);
    }

    dissconect() {
        return BleClient.disconnect(this.currentTargetId);
    }

    activatRecconectProcess() {
        BleClient.disconnect(this.currentTargetId).then(() => {
            this.isConnectedFlag = false;
            this.notifyDisconnect.next({isManually: false, status: true});
            console.log('Called Disconnect');
            try {

                BleClient.connect(this.currentTargetId).then(
                    (peripheral) => {
                        this.isConnectedFlag = false;
                        this.notifyTargetConnected.next(true);
                        this.onConnected(peripheral);
                    },
                    peripheral => {
                        console.log('Disconnected', 'The peripheral unexpectedly disconnected');
                        if (this.activateReconnectProcessCount < 5) {
                            this.activateReconnectProcessCount++;
                            this.activatRecconectProcess();
                        } else {
                            this.activateReconnectProcessCount = 0;
                        }
                    });
            } catch (e) {
            }
        });
    }

    resetGateway() {
        const dv = new DataView(this.str2ab('R'));
        BleClient.write(this.currentTargetId, SERVICE_2, SERVICE_2_CHAR_WRITE, dv).then((data) => {
            this.notifyResetGateway.next(true);
        });

    }

    str2ab(str) {
        const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        const bufView = new Uint16Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
}
