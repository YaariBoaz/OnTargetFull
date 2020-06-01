import {Injectable, NgZone} from '@angular/core';
import {BLE} from '@ionic-native/ble/ngx';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {BluetoothSerial} from '@ionic-native/bluetooth-serial/ngx';

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
    private peripheral: any;
    private dataFromDevice;
    notifyShotArrived = new BehaviorSubject(0);
    notifyTargetConnected = new BehaviorSubject(false);
    notifyDissconnect = new BehaviorSubject(false);
    private subscription: Subscription;


    constructor(public ble: BLE, private ngZone: NgZone, private bluetoothSerial: BluetoothSerial) {
    }


    scan() {
        this.setStatus('Scanning for Bluetooth LE Devices');
        this.devices = [];  // clear list

        this.ble.scan([], 5).subscribe(
            device => this.onDeviceDiscovered(device),
            error => this.scanError(error)
        );

    }


    setStatus(message) {
        console.log(message);

    }


    onDeviceDiscovered(device) {
        console.log('Discovered ' + JSON.stringify(device, null, 2));
        this.ngZone.run(() => {
            if (this.devices.length === 0) {
                this.devices.push(device);
            } else if (this.devices.find(o => o.id === device.id) === undefined) {
                this.devices.push(device);
            }
        });
    }


    resetShots() {
        const txe = new TextEncoder();
        this.ble.write(this.peripheral.id, SERVICE_2, SERVICE_2_CHAR_WRITE, txe.encode('C\n').buffer).then((prmise) => {
            console.log('From Reset: ' + prmise);
        }).catch(err => {
        });
    }


    // If location permission is denied, you'll end up here
    scanError(error) {
        console.log('Error: ' + error);
    }

    getDevices() {
        return this.devices;
    }

    connect(deviceId) {
        this.subscription = this.ble.connect(deviceId).subscribe(
            (peripheral) => {
                this.notifyTargetConnected.next(true);
                this.onConnected(peripheral);
            },
            peripheral => {
                console.log('Disconnected', 'The peripheral unexpectedly disconnected');
                this.notifyDissconnect.next(true);
                this.distory();
            }
        );
    }

    private onConnected(peripheral: any) {
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


    private handleRead(id, service, characteristic) {
        this.subscription = this.ble.startNotification(id, service, characteristic).subscribe(data => {
            const buffer = new Uint8Array(data);
            const enc = new TextEncoder();
            // @ts-ignore
            const encodedString = enc.encode(buffer);
            const dec = new TextDecoder();
            // tslint:disable-next-line:radix
            const text = parseInt(dec.decode(encodedString));
            this.notifyShotArrived.next(text);
            this.ngZone.run(() => {
                console.log('Read from: ' + service + ' ' + service + ' has arrived: ' + text);
            });
        });
    }


    distory() {
        // this.subscription.unsubscribe();
        // // this.ble.stopNotification(this.peripheral.id, SERVICE_2, SERVICE_2_CHAR).then(() => {
        // // });
        // // if (this.subscription) {
        // //     this.subscription.unsubscribe();
        // // }
        // // this.ble.disconnect(this.peripheral.id).then(() => {
        // //     console.log('Called Disconnect');
        // // });
    }

    isConnected() {
        return this.ble.isConnected(this.peripheral);
    }
}
