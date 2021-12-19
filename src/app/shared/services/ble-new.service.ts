import {Injectable} from '@angular/core';
import {
    BluetoothCallbackType,
    BluetoothLE,
    BluetoothMatchMode,
    BluetoothMatchNum,
    BluetoothScanMode, DeviceInfo,
    ScanParams
} from '@ionic-native/bluetooth-le/ngx';
import {Platform} from '@ionic/angular';
import {Characteristic} from '@ionic-native/bluetooth-le';
import {scan} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BleNewService {
    private services = [];
    private devices = [];
    SERVICE_2 = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
    SERVICE_2_CHAR_WRITE = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';

    constructor(public bluetoothle: BluetoothLE, public plt: Platform) {

        this.plt.ready().then((readySource) => {
            this.bluetoothle.initialize().subscribe(result => {
                if (result.status === 'enabled') {
                } else {
                }
            }, (errorMsg) => {
                console.log('Bluetooth init error: ', errorMsg);
            });

        });
    }


    startScan() {
        const foundDevices = [];
        const params: ScanParams = {
            allowDuplicates: false,
            services: [],
            isConnectable: true,
            matchMode: BluetoothMatchMode.MATCH_MODE_STICKY,
            matchNum: BluetoothMatchNum.MATCH_NUM_MAX_ADVERTISEMENT,
            scanMode: BluetoothScanMode.SCAN_MODE_LOW_POWER
        };
        this.bluetoothle.startScan(params).subscribe((scanResult) => {
            if (scanResult.name) {
                console.log('FOUND DEVICE: ', scanResult.name);
                if (scanResult.name.indexOf('eGate') > -1) {
                    this.stopScan();
                    this.connect(scanResult.address);
                }
                this.devices.push(scanResult);
            }
        }, errorMsg => {
            this.bluetoothle.stopScan();
            this.startScan();
        });
    }


    connect(address) {
        console.log('IN CONECT: ');
        this.stopScan();
        const connectParams = {
            address,
            autoConnect: false
        };
        this.bluetoothle.connect(connectParams).subscribe((connectResult) => {
            this.connectCallback(connectResult);
        }, (errorMsg) => {
            this.bluetoothle.close({address});
            if (errorMsg.message === 'Device previously connected, reconnect or close for new device') {
                this.bluetoothle.disconnect({address: errorMsg.address}).then((disconnectResult) => {
                    this.bluetoothle.reconnect({address: errorMsg.address}).subscribe((reconnectStatus) => {
                        this.connectCallback(reconnectStatus);
                    }, error1 => {
                        console.log(error1);
                    });
                    // tslint:disable-next-line:no-shadowed-variable
                }, (errorMsg) => {
                    console.log(errorMsg);
                    this.connect(address);
                });
            }
        });
    }

    private stopScan() {
        this.bluetoothle.stopScan().then(status => {
            console.log(status);
        }, (errorMsg) => {
            console.log(errorMsg);
        });
    }

    private connectCallback(connectResult: DeviceInfo) {
        this.bluetoothle.initializePeripheral().subscribe((data => {
            console.log(data);
        }));
        this.bluetoothle.subscribe({
            address: connectResult.address,
            service: this.SERVICE_2,
            characteristic: this.SERVICE_2_CHAR_WRITE
        }).subscribe((data) => {
            console.log(data);
        }, (errorMsg) => {
            console.log(errorMsg);
        });

    }

    private getDeviceServices(address: string) {
        this.bluetoothle.discover({address, clearCache: true}).then((result) => {
            console.log('Discover returned with status: ' + result.status);
            if (result.status === 'discovered') {

                // Create a chain of read promises so we don't try to read a property until we've finished
                // reading the previous property.

                const readSequence = result.services.reduce((sequence, service) => {

                    return sequence.then(() => {
                        return this.addService(result.address, service.uuid, service.characteristics);
                    });

                }, Promise.resolve());

                // Once we're done reading all the values, disconnect
                readSequence.then(() => {

                    new Promise((resolve, reject) => {

                        this.bluetoothle.disconnect({address});

                    }).then(this.connectSuccess, (errorMsg) => {
                        console.log(errorMsg);
                    });

                });

            }
        }, (errorMsg) => {
            console.log(errorMsg);
        });
    }

    private connectSuccess() {

    }

    private addService(address: string, uuid: string, characteristics: Characteristic[]) {
        this.services.push({address, uuid, characteristics});
    }
}
