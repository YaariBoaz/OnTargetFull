import {ChangeDetectorRef, Component, NgZone, OnInit,} from '@angular/core';
import {ShootingService} from '../services/shooting.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {StorageService} from '../services/storage.service';
import {BleService} from '../services/ble.service';
import {AlertController, LoadingController, Platform, ToastController} from '@ionic/angular';
import {HitNohitService} from '../drill/hit-nohit.service';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';
import {InitService} from '../services/init.service';
import {BLE} from '@ionic-native/ble/ngx';
import {GatewayService} from '../services/gateway.service';
import {ErrorModalComponent} from '../popups/error-modal/error-modal.component';
import {MatDialog} from '@angular/material/dialog';


const SERVICE_1 = '1800';
const SERVICE_2 = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const SERVICE_2_CHAR = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const SERVICE_2_CHAR_WRITE = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

const READ_WRITE = '2a00';
const READ = '2a01';
const READ1 = '2a04';
const READ2 = '2a06';

@Component({
    selector: 'app-select-target',
    templateUrl: './select-target-component.html',
    styleUrls: ['./select-target.component.scss'],
})
export class SelectTargetComponent implements OnInit {
    targets = [];
    BASE_URL_HTTP = '192.168.0.86:8087';
    socket;
    GET_TARGETS_API;
    chosenTarget = null;
    myTargets = [];
    targetConnected = false;
    selectedTarget = null;
    primaryTarget: null;
    loading: HTMLIonLoadingElement;
    personalTarget: any;
    isFromWizard = false;
    targetIsConnected = false;
    targetNotSelected = true;
    connectedClicked = false;
    isScanning = false;
    personalChosen = false;
    isPersonalTargetAround = false;
    private currentTargetId: string;
    private isConnected: boolean;

    constructor(
        private http: HttpClient,
        private bleService: BleService,
        private storageService: StorageService,
        private shootingService: ShootingService,
        public loadingController: LoadingController,
        private hitNohitService: HitNohitService,
        private ble: BLE,
        public dialog: MatDialog,
        private gatewayService: GatewayService,
        private ngZone: NgZone,
        private screenOrientation: ScreenOrientation,
        private cd: ChangeDetectorRef,
        public toastController: ToastController,
        private zone: NgZone,
        private initService: InitService,
        private nativePageTransitions: NativePageTransitions,
        private platform: Platform,
        public aletMdl: AlertController,
        private router: Router
    ) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.bleService.scanFinished.subscribe(flag => {
            if (flag) {
                this.myTargets = this.storageService.getItem('ble');
            }
        });

    }

    ngOnInit() {
        // this.targetConnected = this.bleService.isConnectedFlag;
        this.platform.ready().then(() => {
            this.screenOrientation.unlock();
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).then((data) => {

            });
        });

        this.gatewayService.notifyTargetConnectedToGateway.subscribe(data => {
            if (data) {
                let flag = false;
                this.myTargets.forEach(target => {
                    if (target.name === data) {
                        flag = true;
                    }
                });
                if (!flag) {
                    this.myTargets.push({name: data});
                    this.cd.detectChanges();
                }
            }
        });

        this.personalTarget = this.storageService.getItem('personalTarget');
        const tempArr = [];
        if (this.personalTarget) {
            // this.myTargets.forEach(target => {
            //     if (target.name !== this.personalTarget.name) {
            //         tempArr.push(target);
            //     } else {
            //         this.isPersonalTargetAround = true;
            //     }
            // });
            // this.myTargets = Object.assign([], tempArr);
        }

        this.bleService.scanFinished.subscribe((flag) => {
            this.isScanning = false;
            if (flag) {
                if (this.loading) {
                    this.loading.dismiss();
                }
            }
        });
    }

    ionViewWillLeave() {

        const options: NativeTransitionOptions = {
            direction: 'up',
            duration: 500,
            slowdownfactor: 3,
            slidePixels: 20,
            iosdelay: 100,
            androiddelay: 150,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 60
        };

        this.nativePageTransitions.slide(options)
            .then(() => {
            })
            .catch(() => {
            });

    }

    clearPrimaryFromList() {
        // @ts-ignore
        if (this.myTargets && this.primaryTarget && this.primaryTarget.id) {
            this.myTargets = this.myTargets.filter((obj) => {
                // @ts-ignore
                return obj.id !== this.primaryTarget.id;
            });
        }
    }

    async showToast(msg: string, color: string) {
        const toast = await this.toastController.create({
            message: msg,
            color,
            duration: 2000,
        });
        toast.present();
    }


    async showConnectingLoader() {
        this.loading = await this.loadingController.create({
            duration: 5000,
            message: 'Connecting to target',
            translucent: true,
            cssClass: 'custom-class custom-loading',
            backdropDismiss: true,
        });
        await this.loading.present();
    }

    async onTargetChosen() {
        this.shootingService.chosenTarget = this.selectedTarget;
        this.targetIsConnected = true;
    }

    startTraining() {
        this.hitNohitService.resetDrill();
        this.router.navigateByUrl('tab2/select');
    }

    onBackPressed() {
    }

    onGetTargets() {
        this.shootingService.setTargetsI();
    }

    async confirmationAlert(message: string) {
        let resolveFunction: (confirm: boolean) => void;
        const promise = new Promise<boolean>((resolve) => {
            resolveFunction = resolve;
        });
        const alert = await this.aletMdl.create({
            header: 'Confirmation',
            message,
            backdropDismiss: false,
            buttons: [
                {
                    text: 'No',
                    handler: () => resolveFunction(false),
                },
                {
                    text: 'Yes',
                    handler: () => resolveFunction(true),
                },
            ],
        });
        await alert.present();
        return promise;
    }

    async reScan() {
        this.isScanning = true;
        this.initGatewayScan();
    }

    onTargetSelected(target: any) {
        this.myTargets.forEach(t => t.isSelected = false);
        target.isSelected = true;
        this.storageService.setItem('slectedTarget', target);
        this.selectedTarget = target;
        this.cd.detectChanges();
        // If its not a gateway we need to connect directly to the target.
        if (target.id) {
            if (this.bleService.isGateway) {
                this.bleService.dissconect().then(data => {
                    this.bleService.isGateway = false;
                    this.bleService.connect(target.id);
                    this.bleService.notifyTargetConnected.subscribe(d => {
                        this.isConnected = true;
                        this.targetNotSelected = false;
                        this.cd.detectChanges();
                    });
                });
            } else {
                this.bleService.connect(target.id);
                this.bleService.notifyTargetConnected.subscribe(data => {
                    this.isConnected = true;
                    this.targetNotSelected = false;
                    this.cd.detectChanges();
                });
            }

        } else {
            this.isConnected = true;
            this.targetNotSelected = false;
            this.cd.detectChanges();
        }
    }

    onGoToEditDrill() {
        if (!this.initService.isGateway) {
            this.shootingService.chosenTarget = this.selectedTarget;
            this.targetIsConnected = true;
            this.zone.run(() => {
                // Your router is here
                this.router.navigateByUrl('/tab2/select');
            });
        }
        this.router.navigateByUrl('/tab2/select');
    }

    onDiscconectTest() {
        ////  this.bleService.distory();
    }

    initGatewayScan() {
        this.myTargets = [];
        this.ble.scan([], 5).subscribe(device => this.onDeviceDiscoveredInitialScan(device), error => this.scanErrorInitialScan(error));
        setTimeout(() => {
            this.isScanning = false;
        }, 5500);
    }

    scanErrorInitialScan(error: any) {
        if (error.indexOf('Location ') > -1) {
            const dialogRef = this.dialog.open(ErrorModalComponent, {
                data: {modalType: 'blueTooth'}
            });
        }
        console.error('BLE SCAN ERROR', error);
    }

    onDeviceDiscoveredInitialScan(device: any) {
        this.ngZone.run(() => {
            if (device.name) {
                console.log('FOUND DEVICE: ' + device.name);
                if (device.name.toLowerCase().includes('adl') ||
                    device.name.toLowerCase().includes('e64') ||
                    device.name.toLowerCase().includes('e1n') ||
                    device.name.toLowerCase().includes('e1n') ||
                    device.name.toLowerCase().includes('eMarn001') ||
                    device.name.toLowerCase().includes('17') ||
                    device.name.toLowerCase().includes('003') ||
                    device.name.toLowerCase().includes('e16') ||
                    device.name.toLowerCase().includes('nordic')) {
                    this.addTargetToList({name: device.name, id: device.id});
                } else if (device.name.toLowerCase().includes('egateway')) {
                    this.bleService.gateways.push(device.id);
                    this.bleService.isGateway = true;
                    this.initService.isGateway = true;
                    this.bleService.connect(device.id);
                }
            }

        });
    }


    onConnectedForTargetName(peripheral: any) {
        console.log('CONNECTED - Gateway/Target Connected ', peripheral);
        this.handleReadForTargetName(peripheral.id, SERVICE_2, SERVICE_2_CHAR);
    }

    // tslint:disable-next-line:no-shadowed-variable
    handleReadForTargetName(id, service, characteristic) {
        this.ble.startNotification(id, service, characteristic).subscribe((data) => {
            const dec = new TextDecoder();
            const enc = new TextEncoder();
            const buffer = new Uint8Array(data);
            this.parseGatewayMessage(buffer, id);
        });
    }

    parseGatewayMessage(buffer: Uint8Array, id) {
        const messageFromGatewaty = String.fromCharCode.apply(null, buffer);
        console.log('MESSAGE: ', messageFromGatewaty);
        if (messageFromGatewaty.indexOf('<') > -1) {
            this.processData(messageFromGatewaty, id);
        }
    }

    processData(input, id) {
        const dataArray = input.replace('<,', '').replace(',>', '').split(',');
        const dataLength = dataArray.length;
        if (dataLength === 4) {
            const primB = dataArray[1];
            switch (primB) {
                case ('B'):
                    this.handleBatteryPrecentage_MSG(dataArray, id);
                    break;
                default:
                    break;

            }
        } else {
            console.error('ProcessData Invalid: {0}, Not 4 Length', input);
        }
    }

    handleBatteryPrecentage_MSG(dataArray, id) {
        const targetName = dataArray[0];
        this.addTargetToList({name: targetName, id});
    }


    distory() {
        this.ble.disconnect(this.currentTargetId).then(() => {
            console.log('Called Disconnect');
        });
    }


    private addTargetToList(target) {
        let flag = false;
        this.myTargets.forEach(t => {
            if (t.name === target.name) {
                flag = true;
            }
        });
        if (!flag) {
            this.myTargets.push(target);
            this.cd.detectChanges();
        }
    }

}



