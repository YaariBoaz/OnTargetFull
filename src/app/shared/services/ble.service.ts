import {Injectable, NgZone} from '@angular/core';
import {BLE} from '@ionic-native/ble/ngx';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {BluetoothSerial} from '@ionic-native/bluetooth-serial/ngx';
import {StorageService} from './storage.service';
import {GatewayService} from './gateway.service';
import {InitService} from './init.service';

const SERVICE_1 = '1800';
const SERVICE_2 = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const SERVICE_2_CHAR = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const SERVICE_2_CHAR_WRITE = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

const READ_WRITE = '2a00';
const READ = '2a01';
const READ1 = '2a04';
const READ2 = '2a06';


const TEMPERATURE_CHARACTERISTIC = 'bbb1';

@Injectable({
    providedIn: 'root'
})
export class BleService {
    devices: any[];
    peripheral: any;
    dataFromDevice;
    notifyShotArrived = new BehaviorSubject(0);
    notifyTargetConnected = new BehaviorSubject(false);
    notifyDissconnect = new BehaviorSubject(null);
    subscription: Subscription;
    scanFinished = new BehaviorSubject<any>(false);
    currentTargetId: any;
    isConnectedFlag = false;
    isGateway: boolean;
    gatewayTargets: { gateway: any; target: any };
    notifyResetGateway = new BehaviorSubject(false);
    gateways = [];

    constructor(
        private storage: StorageService,
        public ble: BLE,
        private ngZone: NgZone,
        private initService: InitService,
        private bluetoothSerial: BluetoothSerial,
        private gatewayService: GatewayService) {
        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%             INIT BLE SERVICE                %%%%%%%%%%%%%%%%%%%%%%%%');
        this.devices = this.storage.getItem('ble');
        if (!this.devices) {
            this.devices = [];
        }
    }

    scan() {
        this.devices = [];  // clear list
        this.storage.setItem('ble', this.devices);
        this.ble.scan([], 5).subscribe(device => this.onDeviceDiscovered(device), error => this.scanError(error));
        setTimeout(() => {
            this.storage.setItem('ble', this.devices);
            this.scanFinished.next(true);
        }, 6000);
    }

    setStatus(message) {
        console.log(message);

    }

    onDeviceDiscovered(device) {
        console.log('Discovered ' + JSON.stringify(device, null, 2));
        this.ngZone.run(() => {
            if (device.name) {
                if (device.name.toLowerCase().includes('adl') ||
                    device.name.toLowerCase().includes('e64') ||
                    device.name.toLowerCase().includes('e16') ||
                    device.name.toLowerCase().includes('egateway') ||
                    device.name.toLowerCase().includes('nordic') ||
                    device.name.toLowerCase().includes('e1')) {
                    if (device.name.toLowerCase().includes('egateway') || device.name.toLowerCase().includes('nordic')) {
                        this.gateways.push(device.id);
                    }
                    if (this.devices.length === 0) {
                        this.devices.push(device);
                        this.storage.setItem('ble', this.devices);
                    } else if (this.devices.find(o => o.id === device.id) === undefined) {
                        this.devices.push(device);
                        this.storage.setItem('ble', this.devices);
                    }
                }
            }
        });
    }


    resetShots() {
        this.gatewayService.initStats();
        const txe = new TextEncoder();
        if (this.peripheral && this.peripheral.id) {
            this.ble.write(this.peripheral.id, SERVICE_2, SERVICE_2_CHAR_WRITE, txe.encode('C\n').buffer).then((prmise) => {
                console.log('From Reset: ' + prmise);
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


    connect(deviceId) {
        if (this.gateways.indexOf(deviceId) > -1) {
            this.isGateway = true;
            this.initService.isGateway = true;
        } else {
            this.resetShots();
        }
        this.currentTargetId = deviceId;
        this.subscription = this.ble.connect(deviceId).subscribe(
            (peripheral) => {
                this.isConnectedFlag = false;
                this.notifyTargetConnected.next(true);
                this.onConnected(peripheral);
            },
            peripheral => {
                console.log('DEVICE DISCONNECT IT SELF', peripheral);
                this.activatRecconectProcess();
            }, () => {
            }
        );
    }

    onConnected(peripheral: any) {
        this.isConnectedFlag = false;
        console.log('Connected to ' + peripheral.name + ' ' + peripheral.id);
        this.ngZone.run(() => {
            this.peripheral = peripheral;
        });
        this.handleRead(peripheral.id, SERVICE_2, SERVICE_2_CHAR);
    }

    onDeviceDisconnected(peripheral) {
        alert('The peripheral unexpectedly disconnected');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DetailPage');
    }

    ionViewWillLeave() {
        console.log('ionViewWillLeave disconnecting Bluetooth');
        this.ble.disconnect(this.peripheral.id).then(
            () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
            () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
        );
    }


    handleRead(id, service, characteristic) {
        this.subscription = this.ble.startNotification(id, service, characteristic).subscribe((data) => {
            const dec = new TextDecoder();
            const enc = new TextEncoder();
            const buffer = new Uint8Array(data);
            if (this.isGateway) {
                this.parseGatewayMessage(buffer);
            } else {
                if (dec.decode(buffer) === 'Clear') {
                    console.log('Target cleared shots');
                } else {
                    // @ts-ignore
                    const encodedString = enc.encode(buffer);
                    // tslint:disable-next-line:radix
                    const text = parseInt(dec.decode(encodedString));
                    this.notifyShotArrived.next(text);
                    this.ngZone.run(() => {
                        console.log('Read from: ' + service + ' ' + service + ' has arrived: ' + text);
                    });
                }
            }
        });
    }

    parseGatewayMessage(buffer: Uint8Array) {
        const messageFromGatewaty = String.fromCharCode.apply(null, buffer);
        console.log('MESSAGE ARRIVED: ' + messageFromGatewaty);
        if (messageFromGatewaty.indexOf('<') > -1) {
            this.gatewayService.processData(messageFromGatewaty);
        } else if (messageFromGatewaty.indexOf('Connecting') > -1) {
            this.gatewayTargets = {gateway: this.currentTargetId, target: messageFromGatewaty.split(' ')[3]};
            this.notifyTargetConnected.next(true);
        } else if (messageFromGatewaty.indexOf('Disconnected') > -1) {
            this.activatRecconectProcess();
        }
    }


    distory() {
        this.ble.disconnect(this.currentTargetId).then(() => {
            this.isConnectedFlag = false;
            this.notifyDissconnect.next({isManually: true, status: true});
            console.log('Called Disconnect');
        });
    }

    isConnected(): Promise<any> {
        return this.ble.isConnected(this.peripheral);
    }

    activatRecconectProcess() {
        this.ble.disconnect(this.currentTargetId).then(() => {
            this.isConnectedFlag = false;
            this.notifyDissconnect.next({isManually: false, status: true});
            console.log('Called Disconnect');
            try {
                this.subscription = this.ble.connect(this.currentTargetId).subscribe(
                    (peripheral) => {
                        this.isConnectedFlag = false;
                        this.notifyTargetConnected.next(true);
                        this.onConnected(peripheral);
                    },
                    peripheral => {
                        console.log('Disconnected', 'The peripheral unexpectedly disconnected');
                        this.activatRecconectProcess();
                    });
            } catch (e) {
            }
        });
    }

    resetGateway() {
        this.ble.write(this.currentTargetId, SERVICE_2, SERVICE_2_CHAR_WRITE, this.str2ab('R')).then((data) => {
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
