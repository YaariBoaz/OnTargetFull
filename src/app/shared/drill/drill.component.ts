import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {ShootingService} from '../services/shooting.service';
import {DrillObject} from '../../tab2/tab2.page';
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
import {ConstantData} from './constants';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';


@Component({
    selector: 'app-session-modal',
    templateUrl: './drill.component.html',
    styleUrls: ['./drill.component.scss'],
})
export class DrillComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {


    public counter = 0;
    public showCounter = false;
    public showResults = false;


    @Input() isHistory = false;
    @Input() historyDrill: DrillObject;
    @ViewChild('container', {static: false}) container: ElementRef;
    @ViewChild('screen', {static: false}) screen: ElementRef;
    @ViewChild('canvas', {static: false}) canvas: ElementRef;
    @ViewChild('downloadLink', {static: false}) downloadLink: ElementRef;
    @ViewChild('scrollMe', {static: true}) myScrollContainer: ElementRef;


    /* FOR DEMO */


    /*  END FOR DEMO*/
    profile: any;
    shots = [];
    drill: DrillObject;
    testConfig: any;
    RANDOM_TIMES = FakeData.RANDOM_TIMES;


    drillFinished = false;

    DEFUALT_PAGE_DATE = ConstantData.DEFUALT_PAGE_DATE;
    pageData = ConstantData.pageData;
    DEFAULT_SUMMARY_OBJECT = ConstantData.DEFAULT_SUMMARY_OBJECT;
    summaryObject = ConstantData.summaryObject;


    height: number;
    width: number;
    private interval;
    stats = [];
    batteryPrecent;
    isConnected = true;
    drillFinishedBefore = false;
    isHit = false;
    private hitNumber = 0;
    isFinish = false;
    shotNumber = 0;
    loader;
    isHitNoHit = true;
    drillHasNotStarted = true;
    drillIsFinished = false;
    isGateway = false;
    selectedTarget: any;
    fakeStats = FakeData.fakeStats;
    fakeShots = FakeData.fakeShots;



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
    ) {
        this.drill = this.shootingService.selectedDrill;
        this.selectedTarget = this.shootingService.chosenTarget;
        this.bleService.connect(this.selectedTarget.id);
        this.isGateway = this.initService.isGateway;
        this.hitNohitService.setDrill(this.drill);
        this.hitNohitService.initStats();
        this.setTimeElapse();
    }


    ngAfterViewInit(): void {
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

        this.testConfig = new countUpTimerConfigModel();
        this.testConfig.timerClass = 'test_Timer_class';
        // timer text values
        this.testConfig.timerTexts = new timerTexts();
        this.testConfig.timerTexts.hourText = ':'; // default - hh
        this.testConfig.timerTexts.minuteText = ':'; // default - mm
        this.testConfig.timerTexts.secondsText = ' '; // default - ss
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.isHistory) {
            this.isHistory = changes.isHistory.currentValue;
        }
        if (changes && changes.historyDrill) {
            this.historyDrill = changes.historyDrill.currentValue;
        }

    }


    initStats() {

        this.hitNohitService.initStats();
        this.gateway.initStats();
        this.resetShots();
        console.log('This is in the init stats of the session');
        this.drillFinished = false;
        this.shots = [];

        this.stats = [];
        this.shotNumber = 0;
        this.isFinish = false;
        this.summaryObject = this.DEFAULT_SUMMARY_OBJECT;
        if (!this.pageData) {
            this.pageData = this.pageData;
        } else {
            this.pageData.counter = 0;
            this.pageData.distanceFromCenter = 0;
            this.pageData.splitTime = '0:00';
            this.pageData.rateOfFire = 0;
            this.pageData.points = 0;
            this.pageData.totalTime = '0:00';
        }
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

    ngOnDestroy() {
        console.log('[OnDestroy] Session Component');
    }


    finishDrill() {
        this.drillFinishedBefore = true;
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
                        this.gateway.startTimer();
                    }, 1);
                }

            }
        }, 1000);
    }

    private startFakeShooting(index) {
        if (index < 5) {
            setTimeout(() => {
                this.stats = [this.fakeStats[index], ...this.stats];
                // @ts-ignore
                this.summaryObject.points = this.fakeStats[index].pageData.totalPoints;
                // @ts-ignore
                this.summaryObject.split = this.fakeStats[index].pageData.totalSplit;
                // @ts-ignore
                this.summaryObject.totalTime = this.fakeStats[index].pageData.totalTime;
                // @ts-ignore
                this.summaryObject.distanceFromCenterAvg = this.fakeStats[index].pageData.distanceFromCenterAvg;
                this.shots.push(this.fakeShots[index]);
                this.startFakeShooting(index + 1);
            }, 1212);
        }
    }

    private startFakeShootingHitNoHit(index) {
        if (index < 5) {
            setTimeout(() => {
                this.stats = [this.fakeStats[index], ...this.stats];
                // @ts-ignore
                this.summaryObject.points = this.fakeStats[index].pageData.totalPoints;
                // @ts-ignore
                this.summaryObject.split = this.fakeStats[index].pageData.totalSplit;
                // @ts-ignore
                this.summaryObject.totalTime = this.fakeStats[index].pageData.totalTime;
                // @ts-ignore
                this.summaryObject.distanceFromCenterAvg = this.fakeStats[index].pageData.distanceFromCenterAvg;
                this.shotNumber = index + 1;
                this.startFakeShootingHitNoHit(index + 1);
            }, 1212);
        }
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

    private registerGatewayNotifications() {
        this.gateway.drillFinishedNotify.subscribe(data => {
            if (data) {
                this.drillIsFinished = true;
            }
        });
        this.gateway.hitArrived.subscribe((data) => {
            if (data && !this.isFinish && data.statsData.stats.length > 0) {
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
        });
        this.gateway.notifyShotArrivedFromGateway.subscribe((data) => {
            if (data) {
                this.shots.push({x: data.x, y: data.y});
            }
        });

    }

    private registerBLENotifications() {
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

}

