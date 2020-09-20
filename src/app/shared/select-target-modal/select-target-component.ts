import {ChangeDetectorRef, Component, Inject, NgZone, OnInit} from '@angular/core';
import {ShootingService} from '../services/shooting.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {StorageService} from '../services/storage.service';
import {BleService} from '../services/ble.service';
import {AlertController, LoadingController, Platform, ToastController} from '@ionic/angular';
import {HitNohitService} from '../drill/hit-nohit.service';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

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
    private loading: HTMLIonLoadingElement;
    personalTarget: any;
    private isFromWizard = false;
    targetIsConnected = false;
    targetNotSelected = true;
    connectedClicked = false;
    isScanning = false;

    constructor(private http: HttpClient,
                private bleService: BleService,
                private storageService: StorageService,
                private shootingService: ShootingService,
                public loadingController: LoadingController,
                private hitNohitService: HitNohitService,
                private screenOrientation: ScreenOrientation,
                private cd: ChangeDetectorRef,
                public toastController: ToastController,
                private zone: NgZone,
                private platform: Platform,
                public aletMdl: AlertController,
                private router: Router) {
       // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    }


    ngOnInit() {
        this.targetConnected = this.bleService.isConnectedFlag;
        this.platform.ready().then(() => {
            // this.screenOrientation.unlock();
            // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).then((data) => {
            //
            // });
        });

        this.primaryTarget = this.storageService.getItem('target');
        this.myTargets = this.storageService.getItem('ble');
        if (this.myTargets && this.primaryTarget) {
            this.myTargets = this.myTargets.filter((obj) => {
                // @ts-ignore
                return obj.id !== this.primaryTarget.id;
            });
        }


        this.bleService.notifyTargetConnected.subscribe(status => {
            if (status) {
                this.connectedClicked = false;
                if (!this.selectedTarget) {
                    this.selectedTarget = this.shootingService.chosenTarget;
                }
                this.selectedTarget.targetConnected = status;
                this.targetIsConnected = true;
                if (this.loading) {
                    this.loading.dismiss();
                }
            }
            this.cd.detectChanges();

        });

        this.bleService.notifyDissconnect.subscribe((flag) => {
            if (this.selectedTarget) {
                this.selectedTarget.targetConnected = false;
            }
            if (this.loading) {
                this.loading.dismiss();
            }

            this.targetConnected = false;
            this.targetIsConnected = false;
        });

        this.bleService.scanFinished.subscribe((flag) => {
            if (this.isScanning) {
                this.isScanning = false;
                this.myTargets.push({
                    name: 'E1N1'
                });
            }
            // if (flag) {
            //     if (this.loading) {
            //         this.loading.dismiss();
            //     }
            //     this.myTargets = this.storageService.getItem('ble');
            //     this.cd.detectChanges();
            //     let amountOfTargetsFound = 0;
            //     if (this.myTargets.length > 0) {
            //         // this.connectToPrimaryTarget();
            //         amountOfTargetsFound = this.myTargets.length;
            //         // this.clearPrimaryFromList();
            //         this.showToast('Found ' + amountOfTargetsFound + ' Targets in range', 'success');
            //     } else {
            //         this.showToast('No targets were found, Try scanning again.', 'danger');
            //     }
            // }
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
            duration: 2000
        });
        toast.present();
    }

    getOnlineTargets() {
        this.http.get(this.GET_TARGETS_API).subscribe((data: any) => {
            this.targets = data;
            this.myTargets = data;
        });
    }

    async showConnectingLoader() {
        this.loading = await this.loadingController.create({
            duration: 5000,
            message: 'Connecting to target',
            translucent: true,
            cssClass: 'custom-class custom-loading',
            backdropDismiss: true
        });
        await this.loading.present();
    }

    async onTargetChosen() {
        this.shootingService.chosenTarget = this.selectedTarget;
        this.bleService.connect(this.selectedTarget.id);
    }


    startTraining() {
        this.hitNohitService.resetDrill();
        this.router.navigateByUrl('home/tabs/tab2/select');
    }

    onBackPressed() {
    }

    onGetTargets() {
        this.shootingService.setTargetsI();
    }

    async confirmationAlert(message: string) {
        let resolveFunction: (confirm: boolean) => void;
        const promise = new Promise<boolean>(resolve => {
            resolveFunction = resolve;
        });
        const alert = await this.aletMdl.create({
            header: 'Confirmation',
            message,
            backdropDismiss: false,
            buttons: [
                {
                    text: 'No',
                    handler: () => resolveFunction(false)
                },
                {
                    text: 'Yes',
                    handler: () => resolveFunction(true)
                }
            ]
        });
        await alert.present();
        return promise;
    }

    async reScan() {
        this.isScanning = true;
        this.bleService.scan();
    }

    onTargetSelected(target: any) {
        target.isSelected = true;
        this.storageService.setItem('slectedTarget', target);
        this.selectedTarget = target;
        this.targetNotSelected = false;
    }


    onGoToEditDrill() {
        this.zone.run(() => {
            // Your router is here
            this.router.navigateByUrl('home/tabs/tab2/select');
        });
    }

    onDiscconectTest() {
        this.bleService.distory();
    }


}
