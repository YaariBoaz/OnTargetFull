import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef, HostListener,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {ShootingService} from '../services/shooting.service';
import {DrillObject, DrillType} from '../../tab2/tab2.page';
import {StorageService} from '../services/storage.service';
import {countUpTimerConfigModel, CountupTimerService, timerTexts} from 'ngx-timer';
import {UserService} from '../services/user.service';
import {ApiService} from '../services/api.service';
import {BleService} from '../services/ble.service';
import {HitNohitService} from './hit-nohit.service';
import {Router} from '@angular/router';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {GatewayService} from '../services/gateway.service';
import {InitService} from '../services/init.service';
import {FakeData} from './fakeData';
import {ConstantData, TargetType} from './constants';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';
import {BalisticCalculatorService} from '../services/balistic-calculator.service';


@Component({
    selector: 'app-session-modal',
    templateUrl: './drill.component.html',
    styleUrls: ['./drill.component.scss'],
})
export class DrillComponent implements OnInit, OnChanges, OnDestroy {


    public counter = 0;
    public showCounter = false;
    public showResults = false;


    @Input() isHistory = false;
    @Input() historyDrill: DrillObject;
    @ViewChild('container') container: ElementRef;
    @ViewChild('screen') screen: ElementRef;
    @ViewChild('canvas') canvas: ElementRef;
    @ViewChild('downloadLink') downloadLink: ElementRef;
    @ViewChild('scrollMe', {static: true}) myScrollContainer: ElementRef;

    profile: any;
    shots = [];
    shotsThatAreNotCounted = [];
    drill: DrillObject;
    timerConfig: any;
    RANDOM_TIMES = FakeData.RANDOM_TIMES;


    drillFinished = false;

    pageData = ConstantData.pageData;
    DEFAULT_SUMMARY_OBJECT = ConstantData.DEFAULT_SUMMARY_OBJECT;
    summaryObject = ConstantData.summaryObject;


    height: number;
    width: number;
    stats = [];
    batteryPercent;
    isConnected = true;
    isFinish = false;
    shotNumber = 0;
    loader;
    isHitNoHit = true;
    drillHasNotStarted = true;
    drillIsFinished = false;
    isGateway = false;
    selectedTarget: any;
    targetType: TargetType;
    isZero: boolean;

    clicksObject: ClicksObject = {leftClick: null, rightClick: null, upClick: null, downClick: null};
    groupingStatus: string;
    groupingNumber;

    public get targetTypeEnum(): typeof TargetType {
        return TargetType;
    }

    public get drillTypeEnum(): typeof DrillType {
        return DrillType;
    }

    constructor(
        private screenOrientation: ScreenOrientation,
        private storageService: StorageService,
        private shootingService: ShootingService,
        private countupTimerService: CountupTimerService,
        public toastController: ToastController,
        private userService: UserService,
        private apiService: ApiService,
        private nativePageTransitions: NativePageTransitions,
        private bleService: BleService,
        private gateway: GatewayService,
        private cd: ChangeDetectorRef,
        public loadingController: LoadingController,
        private router: Router,
        private ngZone: NgZone,
        private initService: InitService,
        public alertController: AlertController,
        private hitNohitService: HitNohitService,
        private balisticCalculatorService: BalisticCalculatorService
    ) {
        this.drill = this.shootingService.selectedDrill;
        this.selectedTarget = this.shootingService.chosenTarget;
        this.setTargetType(JSON.parse(localStorage.getItem('slectedTarget')).name);
        this.isGateway = this.initService.isGateway;
        this.hitNohitService.setDrill(this.drill);
        this.hitNohitService.initStats();
        this.setTimeElapse();
        this.isZero = this.shootingService.getisZero();
        this.balisticCalculatorService.resetStats();
        if (this.isZero) {
            const napar = this.balisticCalculatorService.calcNapar(true, this.targetType);
            this.shotsThatAreNotCounted.push({x: napar.napar.x, y: napar.napar.y, isNapar: true});
        }
    }


    ngOnInit() {
        this.profile = this.userService.getUser();
        this.removeTabs();
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
        this.registerNotifications();
    }

    async showLoader(message: string) {
        this.loader = await this.loadingController.create({
            cssClass: 'my-custom-class',
            spinner: null,
            duration: 10000,
            message,
            translucent: true,
            backdropDismiss: true
        });
        await this.loader.present();
    }

    async showToast(msg: string, color: string) {
        const toast = await this.toastController.create({
            message: msg,
            color,
            duration: 2000
        });
        toast.present();
    }


    setTimeElapse() {
        this.countupTimerService.stopTimer();
        this.countupTimerService.setTimervalue(0);

        this.timerConfig = new countUpTimerConfigModel();
        this.timerConfig.timerClass = 'test_Timer_class';
        // timer text values
        this.timerConfig.timerTexts = new timerTexts();
        this.timerConfig.timerTexts.hourText = ':'; // default - hh
        this.timerConfig.timerTexts.minuteText = ':'; // default - mm
        this.timerConfig.timerTexts.secondsText = ' '; // default - ss
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.isHistory) {
            this.isHistory = changes.isHistory.currentValue;
        }
        if (changes && changes.historyDrill) {
            this.historyDrill = changes.historyDrill.currentValue;
        }

    }

    @HostListener('unloaded')
    ngOnDestroy() {
        console.log('Items destroyed');
    }


    initStats() {
        this.balisticCalculatorService.resetStats();
        this.hitNohitService.initStats();
        this.gateway.initStats();
        this.resetShots();
        console.log('This is in the init stats of the session');
        this.drillFinished = false;
        this.shots = [];
        this.shotsThatAreNotCounted = [];
        this.stats = [];
        this.shotNumber = 0;
        this.isFinish = false;
        this.summaryObject = this.DEFAULT_SUMMARY_OBJECT;
        this.pageData.counter = 0;
        this.pageData.distanceFromCenter = 0;
        this.pageData.splitTime = '0:00';
        this.pageData.rateOfFire = 0;
        this.pageData.points = 0;
        this.pageData.totalTime = '0:00';
        if (this.countupTimerService) {
            this.countupTimerService.stopTimer();
            this.countupTimerService.setTimervalue(0);
        }

    }

    async onBackPressed() {
        this.drillIsFinished = false;
        const content: any = document.querySelector('mat-tab-header');
        if (content) {
            content.style.display = 'flex';
        }

        if (this.drill === null || this.stats.length !== this.drill.numOfBullets) {
            await this.closeDrillBeforeFinish(false);
        } else {
            this.gateway.initStats();
            this.hitNohitService.resetDrill();
            this.router.navigateByUrl('/tab2/select');
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        }
    }

    ionViewWillEnter() {
        this.bleService.isConnected().then((status) => {
            console.log('IS CONNECTED: ', status);
        }, error => {
            console.log(error);
        });
        this.drill = this.shootingService.selectedDrill;
        this.countupTimerService.stopTimer();
        this.countupTimerService.setTimervalue(0);
        this.drillHasNotStarted = true;
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE).then(r => {
        });
        this.showResults = false;
        this.showCounter = false;
        this.drillHasNotStarted = true;
    }


    finishDrill() {
        this.drillFinished = true;
        this.countupTimerService.stopTimer();
        console.log('FINISH!!!!!!!!!!!!!!!!!');
    }


    async restartShooting() {
        this.drillIsFinished = false;
        if (this.stats.length !== this.drill.numOfBullets) {
            await this.closeDrillBeforeFinish(true);
        } else {
            this.initStats();
            this.bleService.resetShots();
            this.stats = [];
        }
    }

    resetShots() {
        this.bleService.resetShots();
        this.stats = [];
    }


    async closeDrillBeforeFinish(isReset) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Confirm!',
            message: 'You haven\'t finished your drill, Do you want to save the data?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Pressed Cancel');
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        this.ngZone.runGuarded(() => {
                            if (this.isGateway) {
                                this.gateway.updateHistory();
                                this.gateway.initStats();
                            } else {
                                this.hitNohitService.updateHistory();
                                this.hitNohitService.initStats();
                            }
                            this.initStats();
                            this.bleService.resetShots();
                            this.stats = Object.assign(this.stats, []);
                            if (!isReset) {
                                this.router.navigateByUrl('/tab2/select');
                                this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
                            }
                        });
                    }
                },
                {
                    text: 'No',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        this.ngZone.runGuarded(() => {
                            if (this.isGateway) {
                                this.gateway.initStats();
                            } else {
                                this.hitNohitService.initStats();
                            }
                            this.initStats();
                            this.bleService.resetShots();
                            this.stats = Object.assign(this.stats, []);
                            if (!isReset) {
                                this.router.navigateByUrl('/tab2/select');
                                this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
                            }
                        });
                    }
                }
            ]
        });
        await alert.present();
    }

    onReconnect() {
        this.bleService.connect(this.bleService.currentTargetId);
    }

    activateCounter() {
        this.counter = 3;
        this.showCounter = true;

        const interval = setInterval(() => {
            this.counter--;
            if (this.counter < 1) {
                this.counter = 3;
                this.showResults = true;
                this.showCounter = false;
                this.drillHasNotStarted = false;
                this.bleService.resetShots();
                clearInterval(interval);
                if (this.isGateway) {
                    setTimeout(() => {
                        this.gateway.height = this.container.nativeElement.offsetHeight;
                        this.gateway.width = this.container.nativeElement.offsetWidth;
                        this.balisticCalculatorService.divWidth = 245;
                        this.balisticCalculatorService.divHeight = 245;
                        this.gateway.startTimer();
                    }, 1);
                }

            }
        }, 1000);
    }

    private removeTabs() {
        const content: any = document.querySelector('mat-tab-header');
        if (content) {
            content.style.display = 'none';
        }
    }

    private registerNotifications() {
        this.registerHitNoHitNotifications();
        this.registerGatewayNotifications();
        this.registerBLENotifications();
        this.shootingService.drillStarteEvent.subscribe(data => {
            if (data) {
                this.drillIsFinished = false;
            }
        });
    }

    private registerHitNoHitNotifications() {
        this.hitNohitService.hitArrived.subscribe((data) => {
            if (data !== null && !this.drillHasNotStarted) {
                this.shotNumber = data.hitNumber;
                this.stats = data.statsData.stats;
                this.pageData = data.statsData.page;
                this.isFinish = data.statsData.isFinish;
                this.summaryObject = data.statsData.summaryObject;
                this.cd.detectChanges();
            }
        });
        this.hitNohitService.drillFinishedNotify.subscribe(data => {
            if (data) {
                this.drillIsFinished = true;
            }
        });
        this.hitNohitService.resetDrillSubject.subscribe((flag) => {
            if (flag) {
                this.initStats();
            }
        });
    }

    registerGatewayNotifications() {
        this.gateway.drillFinishedNotify.subscribe(data => {
            if (data) {
                this.drillIsFinished = true;
            }
        });
        this.gateway.hitArrived.subscribe((data) => {
            if (data && !this.isFinish && data.statsData.stats.length > 0) {
                if (data.statsData.zeroData) {
                    this.clicksObject.leftClick = data.statsData.zeroData.leftClick;
                    this.clicksObject.upClick = data.statsData.zeroData.upclick;
                    this.clicksObject.rightClick = data.statsData.zeroData.rightClick;
                    this.clicksObject.downClick = data.statsData.zeroData.downClick;
                    this.groupingNumber = data.statsData.zeroData.napar2Napam;
                    this.groupingStatus = data.statsData.zeroData.status;
                    this.shots.push({x: data.statsData.shot.x, y: data.statsData.shot.y});
                    if (data.statsData.zeroData.napamToView.x !== 0 && data.statsData.zeroData.napamToView.y !== 0) {
                        this.shotsThatAreNotCounted.push({
                            x: data.statsData.zeroData.napamToView.x,
                            y: data.statsData.zeroData.napamToView.y,
                            isNapam: true
                        });
                    }
                    this.cd.detectChanges();
                    this.stats = data.statsData.stats;
                    this.pageData = data.statsData.pageData;
                    this.isFinish = data.statsData.isFinish;
                    this.summaryObject = data.statsData.summaryObject;
                    this.scrollToBottom();
                    if (this.drill.numOfBullets === this.stats.length) {
                        this.drillIsFinished = true;
                        this.cd.detectChanges();
                    }

                } else {
                    this.shotNumber = data.hitNumber;
                    this.stats = data.statsData.stats;
                    this.pageData = data.statsData.pageData;
                    this.isFinish = data.statsData.isFinish;
                    this.summaryObject = data.statsData.summaryObject;
                    this.shots.push({x: data.statsData.shot.x, y: data.statsData.shot.y});
                    this.cd.detectChanges();
                    this.scrollToBottom();
                    if (this.drill.numOfBullets === this.stats.length) {
                        this.drillIsFinished = true;
                        this.cd.detectChanges();
                    }
                }
            }
        });
        this.gateway.notifyShotArrivedFromGateway.subscribe((data) => {
            if (data) {
                this.shots.push({x: data.x, y: data.y});
            }
        });

    }

    registerBLENotifications() {
        this.bleService.notifyTargetConnected.subscribe(status => {
            if (status) {
                this.isConnected = true;
                // const loader = this.showToast('Target Connected', 'success');
            }
        });
        this.bleService.notifyDissconnect.subscribe((flag) => {
            if (flag) {
                if (!flag.isManually) {
                    // this.isConnected = false;
                    // this.cd.detectChanges();
                    // const loader = this.showToast('The target has been disconnected \n System trying to reconnect', 'danger');
                }
            }
        });
    }

    scrollToBottom() {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
        }
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

    setTargetType(name) {
        if (name === '003' || name.indexOf('64')) {
            this.targetType = TargetType.Type_64;
        } else if (name.indexOf('128') > -1) {
            this.targetType = TargetType.Type_128;
        } else {
            this.targetType = TargetType.Type_16;
        }
    }

}

export interface ClicksObject {
    leftClick: number;
    upClick: number;
    rightClick: number;
    downClick: number;
}
