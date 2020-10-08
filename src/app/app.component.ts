import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Platform} from '@ionic/angular';
import {InitService} from './shared/services/init.service';
import {LoadingController} from '@ionic/angular';
import {BleService} from './shared/services/ble.service';
import {Plugins} from '@capacitor/core';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';

const {SplashScreen} = Plugins;



@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
    private devices;
    splash = true;


    constructor(
        private platform: Platform,
        private initService: InitService,
        public ble: BleService,
        public loadingController: LoadingController,
        private screenOrientation: ScreenOrientation
    ) {

        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        SplashScreen.hide();
        this.initService.getDashboard();
        this.initService.getSights();
        this.initService.getWeapons();
        this.platform.ready().then(() => {
            this.ble.scan();
            window.addEventListener('beforeunload', () => {
                this.ble.distory();
            });
        });
        this.initService.isLoading.subscribe(data =>{

        })
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
        console.log('Loading dismissed with role:', role);
    }


    ngOnDestroy(): void {
        console.log('App Destoryed');

    }

}
