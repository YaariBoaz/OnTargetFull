import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {AlertController, ModalController, Platform} from '@ionic/angular';
import {ShootingService} from '../shared/services/shooting.service';
import {StorageService} from '../shared/services/storage.service';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {Router} from '@angular/router';
import {InitService} from '../shared/services/init.service';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';
import {MatDialog} from '@angular/material/dialog';
import {BalisticCalculatorComponent} from './balistic-calculator/balistic-calculator.component';
import {TargetType} from '../shared/drill/constants';
import {BalisticCalculatorService} from '../shared/services/balistic-calculator.service';
import {GatewayService} from '../shared/services/gateway.service';
import {Backgrounds} from '../shared/drill/drill.component';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
    @ViewChild('slides') slides;
    public selectedDrillType: DrillType = DrillType.Regular;
    slideOpts = {
        slidesPerView: 2.3,
        spaceBetween: 3
    };

    mySights;
    myGuns;
    myAmmo;
    chosenWeaponType = 0;
    drill: DrillObject = {
        name: '',
        numOfBullets: 5,
        weapon: 'Rifle',
        range: 150,
        rangeUOM: 'Yards',
        sight: '',
        ammo: '',
        bg: Backgrounds.DESERT,
        // @ts-ignore
        drillType: DrillType.Regular,
        shots: new Array<{ x, y }>()
    };
    connectedTarget = null;
    targetType: TargetType;

    public get targetTypeEnum(): typeof TargetType {
        return TargetType;
    }

    public get drillTypeEnum(): typeof DrillType {
        return DrillType;
    }

    public get backgroundsEnum(): typeof Backgrounds {
        return Backgrounds;
    }

    constructor(public modalController: ModalController,
                public alertController: AlertController,
                private initService: InitService,
                private shootingService: ShootingService,
                private nativePageTransitions: NativePageTransitions,
                private storageService: StorageService,
                private screenOrientation: ScreenOrientation,
                public dialog: MatDialog,
                private zone: NgZone,
                private gatewayService: GatewayService,
                private balisticCalculatorService: BalisticCalculatorService,
                private router: Router,
                private platform: Platform
    ) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.connectedTarget = this.shootingService.chosenTarget;
        this.initComponents();

        // const targetId = this.storageService.getItem('slectedTarget').name;
        // this.targetType = this.gatewayService.getTargetType(targetId);
        if (this.targetType === TargetType.Type_64 || this.targetType === TargetType.Type_128) {
            this.drill.drillType = DrillType.Regular;
        } else {
            this.drill.drillType = DrillType.HitNoHit;
        }

    }

    ionViewWillEnter() {
        const targetId = this.storageService.getItem('slectedTarget').name;
        this.targetType = this.gatewayService.getTargetType(targetId);
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

    }

    initComponents() {
        this.mySights = this.storageService.getItem('sightList');
        // this.mySights.push('M5');
        // this.mySights.push('Iron');
        // this.mySights.push('Iron');
        // this.mySights.splice(2, 0, 'Wizer');


        // this.myGuns = this.storageService.getItem('gunList');
        // this.myGuns.push('AR15');
        // this.myGuns.push('Jericho 941f');
        // this.myGuns.splice(2, 0, 'Circus');

        // this.myAmmo = this.storageService.getItem('caliberList');

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
        if (this.drill.drillType === this.drillTypeEnum.Zero) {
            this.shootingService.setIsZero(true);
        } else {
            this.shootingService.setIsZero(false);
        }
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

    onBalisticCalculatorPressed() {
        this.shootingService.selectedDrill = this.drill;
        this.shootingService.numberOfBullersPerDrill = this.drill.numOfBullets;

        const ammoObject = this.myAmmo[this.drill.ammo][0];
        this.shootingService.caliber = ammoObject.caliber;
        this.shootingService.bulletName = ammoObject.name;


        this.balisticCalculatorService.getBallisticData(this.drill.weapon, this.drill.sight).subscribe((data: any) => {
            const dialogRef = this.dialog.open(BalisticCalculatorComponent, {
                maxWidth: '100vw',
                maxHeight: '100vh',
                height: '100%',
                width: '100%',
                data: {
                    weaopn: this.drill.weapon,
                    sight: this.drill.sight,
                    ballisticCoefficient: data.ballisticCoefficient,
                    initialVelocity: data.initialVelocity,
                    sightHeight: data.sightHeight
                },
                panelClass: 'dialog-bg'
            });
            // tslint:disable-next-line:no-shadowed-variable
            dialogRef.afterClosed().subscribe((data: any) => {
                if (!data || !data.isBack) {
                    this.router.navigateByUrl('drill');
                }
            });
        });

    }

    onNumberOfBulletsChange(val) {
        if (val === 0 || val < 0) {
            this.drill.numOfBullets = 1;
        }
    }
}

export interface DrillObject {
    numOfBullets: number;
    weapon: string;
    range: number;
    rangeUOM: string;
    sight: string;
    ammo: any;
    drillType: DrillType;
    name: string;
    bg: Backgrounds;
    shots: Array<{ x: number, y: number }>;
}


export enum DrillType {
    Regular,
    Hostage,
    ABC,
    Zero,
    Surprise,
    Surprise3Z,
    HitNoHit = 6
}
