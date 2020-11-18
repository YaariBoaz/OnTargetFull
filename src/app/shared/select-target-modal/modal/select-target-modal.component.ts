import {ChangeDetectorRef, Component, Inject, NgZone, OnInit} from '@angular/core';
import {ShootingService} from '../../services/shooting.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {StorageService} from '../../services/storage.service';
import {BleService} from '../../services/ble.service';
import {AlertController, LoadingController, Platform, ToastController} from '@ionic/angular';
import {HitNohitService} from '../../drill/hit-nohit.service';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WizardService} from '../../authentication/signup-wizard/wizard.service';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-select-target-modal',
    templateUrl: './select-target-modal.component.html',
    styleUrls: ['./select-target-modal.component.scss'],
})
export class SelectTargetModalComponent implements OnInit {
    targets = [];
    BASE_URL_HTTP = '192.168.0.86:8087';
    isScanning = true;
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

    constructor(private http: HttpClient,
                private bleService: BleService,
                private storageService: StorageService,
                private shootingService: ShootingService,
                public loadingController: LoadingController,
                private hitNohitService: HitNohitService,
                private screenOrientation: ScreenOrientation,
                private cd: ChangeDetectorRef,
                public dialogRef: MatDialogRef<SelectTargetModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private snackBar: MatSnackBar,
                private wizardService: WizardService,
                private zone: NgZone,
                private platform: Platform,
                public aletMdl: AlertController,
                private router: Router) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.isFromWizard = this.data.isFromWizard;

        document.addEventListener('backbutton', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.dialogRef.close();
            this.wizardService.selectTargetFromWizardOpened.next(true);
        }, false);

    }


    ngOnInit() {
        this.platform.ready().then(() => {
            this.screenOrientation.unlock();
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).then((data) => {

            });
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
                    this.selectedTarget = this.shootingService.chosenTarget = this.selectedTarget;
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
            if (flag) {
                this.isScanning = false;
                if (this.loading) {
                    this.loading.dismiss();
                }
                this.myTargets = this.storageService.getItem('ble');
                this.cd.detectChanges();
                let amountOfTargetsFound = 0;
                if (this.myTargets.length > 0) {
                    // this.connectToPrimaryTarget();
                    amountOfTargetsFound = this.myTargets.length;
                    // this.clearPrimaryFromList();
                    this.showToast('Found ' + amountOfTargetsFound + ' Targets in range', 'success', true);
                } else {
                    this.showToast('No targets were found, Try scanning again.', 'danger', false);
                }
            }
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

    showToast(msg: string, color: string, flag) {
        let className = 'red-snackbar';
        if (flag) {
            className = 'green-snackbar';
        }
        this.snackBar.open(msg, '', {
            duration: 3000,
            panelClass: [className]
        });
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
        this.router.navigateByUrl('/tab2/select');
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
        this.loading = await this.loadingController.create({
            duration: 5000,
            message: 'Scanning For Targets',
            translucent: true,
            cssClass: 'custom-class custom-loading',
            backdropDismiss: true
        });
        await this.loading.present();
    }

    onTargetSelected(target: any) {
        this.myTargets.forEach(t => {
            t.isSelected = true;
        });
        target.isSelected = true;
        this.storageService.setItem('slectedTarget', target);
        this.selectedTarget = target;
        this.targetNotSelected = false;
    }

    onGoToEditDrill() {
        if (this.isFromWizard) {
            this.zone.runGuarded(() => {
                this.storageService.setItem('personalTarget', this.selectedTarget);
                this.dialogRef.close();
            });
        } else {
            this.router.navigateByUrl('/tab2/select');
        }
    }

    onDiscconectTest() {
        //
        // this.ini.distory();
    }


}
