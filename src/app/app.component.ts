import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Platform} from '@ionic/angular';
import {InitService} from './shared/services/init.service';
import {LoadingController} from '@ionic/angular';
import {BleService} from './shared/services/ble.service';
import {Plugins} from '@capacitor/core';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {PopupsService} from './shared/services/popups.service';
  import {ErrorModalComponent} from './shared/popups/error-modal/error-modal.component';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';
import {MatDialog} from '@angular/material/dialog';

const {SplashScreen} = Plugins;
const {Network} = Plugins;


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
    private devices;
    splash = true;
    isLoding = false;

    constructor(
        private platform: Platform,
        private initService: InitService,
        private nativePageTransitions: NativePageTransitions,
        public ble: BleService,
        private popupsService: PopupsService,
        public loadingController: LoadingController,
        private screenOrientation: ScreenOrientation,
        public dialog: MatDialog
    ) {


        Network.addListener('networkStatusChange', (status) => {
            if (!status.connected) {
                const dialogRef = this.dialog.open(ErrorModalComponent, {
                    data: {modalType: 'wifi'}
                });
            }
        });


        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.initService.getSights();
        this.initService.getWeapons();
        this.initService.getCalibers();
        this.platform.ready().then(() => {

            SplashScreen.hide().then(r => {
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
            });
            this.platform.backButton.subscribeWithPriority(9999, () => {
                document.addEventListener('backbutton', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                }, false);

            });
            window.addEventListener('beforeunload', () => {
                this.initService.distory();
            });

        });
        this.initService.isLoading.subscribe((isLoading: boolean) => {
            this.isLoding = isLoading;
        });
    }

    ngOnInit() {
        setTimeout(() => {
            this.splash = false;
        }, 5000);

        this.ble.notifyDissconnect.subscribe((flag) => {
            if (flag) {

            }
        });
    }


    async presentLoadingWithOptions() {
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            spinner: 'bubbles',
            duration: 2000,
            message: 'Unexpected disconnection, Reconnecting to the target',
            translucent: true,
            backdropDismiss: true
        });
        await loading.present();

        const {role, data} = await loading.onDidDismiss();
    }


    ngOnDestroy(): void {

    }

}
