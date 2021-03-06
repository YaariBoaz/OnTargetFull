import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {ModalController, Platform} from '@ionic/angular';
import {AlertController} from '@ionic/angular';
import {ShootingService} from '../shared/services/shooting.service';
import {StorageService} from '../shared/services/storage.service';
import {TabsService} from '../tabs/tabs.service';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {BleService} from '../shared/services/ble.service';
import {Router} from '@angular/router';
import {InitService} from '../shared/services/init.service';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
    @ViewChild('slides') slides;
    public selectedDrillType: DrillType = DrillType.Regular;
    slideOpts = {
        slidesPerView: 2.1,
        spaceBetween: 3
    };

    mySights;
    myGuns;
    drill: DrillObject = {
        numOfBullets: 5,
        weapon: 'M4 Carbine',
        range: 150,
        rangeUOM: 'Meters',
        sight: 'V6 5-30 X 50',
        ammo: 'Creedmor 6.5',
        drillType: DrillType.Regular,
        shots: new Array<{ x, y }>()
    };
    connectedTarget = null;

    constructor(public modalController: ModalController,
                private tabService: TabsService,
                public alertController: AlertController,
                private initService: InitService,
                private shootingService: ShootingService,
                private nativePageTransitions: NativePageTransitions,
                private storageService: StorageService,
                private screenOrientation: ScreenOrientation,
                private zone: NgZone,
                private router: Router,
                private platform: Platform) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.initComponents();
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


    ngOnInit(): void {
        this.tabService.$notifyTab2.subscribe(() => {
            this.initComponents();
        });
    }

    initComponents() {
        this.mySights = this.storageService.getItem('sightList');
        // this.mySights.push('M5');
        // this.mySights.push('Iron');
        // this.mySights.push('Iron');
        this.mySights.splice(2, 0, 'Wizer');


        this.myGuns = this.storageService.getItem('gunList');
        // this.myGuns.push('AR15');
        // this.myGuns.push('Jericho 941f');
        this.myGuns.splice(2, 0, 'Circus');


        this.setSightsAndWeapons();
    }


    slideDidChange(event) {
        this.slides.getActiveIndex().then(index => {
            switch (index) {
                case 0:
                    if (!this.initService.isGateway) {
                        this.drill.drillType = DrillType.Regular;
                    } else {
                        this.drill.drillType = DrillType.Regular;
                    }
                    break;
                case 1:
                    this.drill.drillType = DrillType.Regular;
                    break;
                case 1:
                    this.drill.drillType = DrillType.Zero;
                    break;
                case 2:
                    this.drill.drillType = DrillType.Hostage;
                    break;
            }

        });
    }


    startSesstion() {
        this.shootingService.drillStarteEvent.next(true);
        this.shootingService.selectedDrill = this.drill;
        this.shootingService.numberOfBullersPerDrill = this.drill.numOfBullets;
    }

    async showLongRangeAlert() {
        const alert = await this.alertController.create({
            header: 'Wifi Error',
            subHeader: 'Wifi not connected to gateway',
            message: 'Please connect to long-range-target',
            buttons: ['OK']
        });

        await alert.present();
    }


    private setSightsAndWeapons() {
        if (this.myGuns) {
            this.drill.weapon = this.myGuns[1];
        } else {
            this.myGuns = this.storageService.DEFAULT_WEAPONS;
            this.drill.weapon = this.myGuns[1];
        }

        if (this.mySights) {
            this.drill.sight = this.mySights[0];
        } else {
            this.mySights = this.storageService.DEFAULT_SIGHTS;
            this.drill.sight = this.mySights[0];
        }
    }

    connectToTarget() {

    }

    onBackPressed() {

        this.zone.run(() => {
            this.router.navigateByUrl('/home');
        });

    }

    isiOS() {
        return this.platform.is('ios');
    }
}

export interface DrillObject {
    numOfBullets: number;
    weapon: string;
    range: number;
    rangeUOM: string;
    sight: string;
    ammo: string;
    drillType: DrillType;
    shots: Array<{ x: number, y: number }>;
}

export enum DrillType {
    Regular,
    Hostage,
    ABC,
    Zero,
    Surprise,
    Surprise3Z
}
