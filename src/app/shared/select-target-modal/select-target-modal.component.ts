import {Component, OnInit} from '@angular/core';
import {ShootingService} from '../services/shooting.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {StorageService} from '../services/storage.service';
import {BleService} from '../services/ble.service';
import {LoadingController} from '@ionic/angular';
import {HitNohitService} from '../drill/hit-nohit.service';

@Component({
    selector: 'app-select-target-modal',
    templateUrl: './select-target-modal.component.html',
    styleUrls: ['./select-target-modal.component.scss'],
})
export class SelectTargetModalComponent implements OnInit {
    targets = [];
    BASE_URL_HTTP = '192.168.0.86:8087';
    socket;
    GET_TARGETS_API;

    myTargets = [];
    targetConnected = false;
    primaryTarget: null;
    private loading: HTMLIonLoadingElement;

    constructor(private http: HttpClient,
                private bleService: BleService,
                private storageService: StorageService,
                private shootingService: ShootingService,
                public loadingController: LoadingController,
                private hitNohitService: HitNohitService,
                private router: Router) {
        this.myTargets = this.storageService.getItem('targetList');

    }

    ngOnInit() {
        this.primaryTarget = this.storageService.getItem('target');
        if (this.primaryTarget) {
            this.showConnectingLoader();
            this.bleService.isConnected().then((status) => {

            }).catch(stats => {
                // @ts-ignore
                this.bleService.connect(this.primaryTarget.id);
            });
        }

        this.bleService.notifyTargetConnected.subscribe(status => {
            this.targetConnected = status;
            if (this.loading) {
                this.loading.dismiss();
            }
        });

        this.bleService.notifyDissconnect.subscribe((flag) => {
            this.targetConnected = false;
            if (this.loading) {
                this.loading.dismiss();
            }
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
            spinner: null,
            duration: 5000,
            message: 'Connecting to target',
            translucent: true,
            cssClass: 'custom-class custom-loading',
            backdropDismiss: true
        });
        await this.loading.present();
    }

    onTargetChosen(target) {
        this.shootingService.chosenTarget = target;
        this.router.navigateByUrl('/home/tabs/tab2/select2');
    }

    startTraining() {
        this.hitNohitService.resetDrill();
        this.router.navigateByUrl('/home/tabs/tab2/select2');
    }

    onBackPressed() {
        this.router.navigateByUrl('/home/tabs/tab2');
    }

    onGetTargets() {
        this.shootingService.setTargetsI();
    }


    onReconnec() {
        this.showConnectingLoader();
        // @ts-ignore
        this.bleService.connect(this.primaryTarget.id);
    }
}
