import {Injectable, NgZone} from '@angular/core';
import {BLE} from '@ionic-native/ble/ngx';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {BluetoothSerial} from '@ionic-native/bluetooth-serial/ngx';
import {StorageService} from './storage.service';

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
    private devices: any[];
    peripheral: any;
    private dataFromDevice;
    notifyShotArrived = new BehaviorSubject(0);
    notifyTargetConnected = new BehaviorSubject(false);
    notifyDissconnect = new BehaviorSubject(false);
    private subscription: Subscription;
    scanFinished = new BehaviorSubject<any>(false);
    currentTargetId: any;


    constructor(private storage: StorageService, public ble: BLE, private ngZone: NgZone, private bluetoothSerial: BluetoothSerial) {
        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%             INIT BLE SERVICE                %%%%%%%%%%%%%%%%%%%%%%%%');
        this.devices = this.storage.getItem('ble');
        if (!this.devices) {
            this.devices = [];
        }


        this.ngZone.onError.subscribe((e) => {
            debugger;
        });

    }

    scan() {
        console.log('*************** SCAN STARTED ***************************');
        this.setStatus('Scanning for Bluetooth LE Devices');
        this.devices = [];  // clear list
        this.storage.setItem('ble', this.devices);
        this.ble.scan([], 5).subscribe(
            device => this.onDeviceDiscovered(device),
            error => this.scanError(error)
        );
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
                    device.name.toLowerCase().includes('e1')) {
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
        this.currentTargetId = deviceId;
        this.subscription = this.ble.connect(deviceId).subscribe(
            (peripheral) => {
                this.notifyTargetConnected.next(true);
                this.onConnected(peripheral);
            },
            peripheral => {
                console.log('Disconnected', 'The peripheral unexpectedly disconnected');
                this.activatRecconectProcess();
            }, () => {
                debugger;
            }
        );
    }

    onConnected(peripheral: any) {
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
        this.subscription = this.ble.startNotification(id, service, characteristic).subscribe(data => {
            const dec = new TextDecoder();
            const enc = new TextEncoder();
            const buffer = new Uint8Array(data);
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
        });
    }

    distory() {
        this.ble.disconnect(this.currentTargetId).then(() => {
            this.notifyDissconnect.next(true);
            console.log('Called Disconnect');
        });
    }

    isConnected() {
        return this.ble.isConnected(this.peripheral);
    }
    activatRecconectProcess() {
        this.ble.disconnect(this.currentTargetId).then(() => {
            this.notifyDissconnect.next(true);
            console.log('Called Disconnect');
            debugger;
            try {
                this.subscription = this.ble.connect(this.currentTargetId).subscribe(
                    (peripheral) => {
                        this.notifyTargetConnected.next(true);
                        this.onConnected(peripheral);
                    },
                    peripheral => {
                        console.log('Disconnected', 'The peripheral unexpectedly disconnected');
                        this.activatRecconectProcess();
                    }, () => {
                        debugger;
                    }
                );
                this.notifyDissconnect.next(true);


            } catch (e) {
                debugger;
            }
        });
    }
}
