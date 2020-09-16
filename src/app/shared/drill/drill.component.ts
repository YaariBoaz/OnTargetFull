import {
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
    @ViewChild('container', {static: false}) container: ElementRef;
    @ViewChild('screen', {static: false}) screen: ElementRef;
    @ViewChild('canvas', {static: false}) canvas: ElementRef;
    @ViewChild('downloadLink', {static: false}) downloadLink: ElementRef;
    shots = [];
    drill: DrillObject;
    testConfig: any;
    RANDOM_TIMES = [5899, 6704, 7003, 6050, 5903];


    drillFinished = false;

    DEFUALT_PAGE_DATE = {
        distanceFromCenter: 0,
        splitTime: '',
        rateOfFire: 0,
        counter: 0,
        points: 0,
        lastShotTime: null,
        totalTime: {} as any
    };
    pageData = {
        distanceFromCenter: 0,
        splitTime: '',
        rateOfFire: 0,
        counter: 0,
        points: 0,
        lastShotTime: null,
        totalTime: {} as any
    };
    DEFAULT_SUMMARY_OBJECT = {
        points: 0,
        distanceFromCenter: 0,
        split: 0,
        totalTime: 0,
        counter: 0
    };
    summaryObject = {
        points: 0,
        distanceFromCenter: 0,
        split: 0,
        totalTime: 0,
        counter: 0
    };

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

    constructor(
        private screenOrientation: ScreenOrientation,
        private storageService: StorageService,
        private shootingService: ShootingService,
        private countupTimerService: CountupTimerService,
        public toastController: ToastController,
        private userService: UserService,
        private apiService: ApiService,
        private bleService: BleService,
        private cd: ChangeDetectorRef,
        public loadingController: LoadingController,
        private router: Router,
        private ngZone: NgZone,
        public alertController: AlertController,
        private hitNohitService: HitNohitService,
    ) {
        this.drill = this.shootingService.selectedDrill;
        console.log(this.drill);
        if (this.drill) {
            for (let i = 0; i < this.drill.numOfBullets; i++) {
                this.stats.push({});
            }
        }


        this.hitNohitService.setDrill(this.drill);
        this.hitNohitService.initStats();
        this.setTimeElapse();
    }

    ngOnInit() {
        const content = document.querySelector('ion-tab-bar');
        content.style.display = 'none';

        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

        this.hitNohitService.drillFinishedNotify.subscribe(data => {
            if (data) {
                this.drillIsFinished = true;
            }
        });

        this.shootingService.drillStarteEvent.subscribe(data => {
            if (data) {
                this.drillIsFinished = false;
            }
        });
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

        this.hitNohitService.resetDrillSubject.subscribe((flag) => {
            if (flag) {
                this.initStats();
            }
        });

        this.bleService.notifyTargetConnected.subscribe(status => {
            if (status) {
                this.isConnected = true;
                this.initStats();
            }
        });

        this.bleService.notifyDissconnect.subscribe((flag) => {
            if (flag) {
                this.isConnected = false;
                this.cd.detectChanges();
                const loader = this.showToast('The target has been disconnected \n System trying to reconnect', 'danger');
            }
        });


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
        const content = document.querySelector('ion-tab-bar');
        content.style.display = 'flex';
        this.initStats();
        if (this.stats.length !== this.drill.numOfBullets) {
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
                                this.hitNohitService.updateHistory();
                                this.router.navigateByUrl('home/tabs/tab2/select');
                                this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

                            });
                        }
                    },
                    {
                        text: 'No',
                        cssClass: 'secondary',
                        handler: (blah) => {
                            this.ngZone.runGuarded(() => {
                                console.log('Pressed No');
                                this.router.navigateByUrl('home/tabs/tab2/select');
                                this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
                            });
                        }
                    }
                ]
            });
            await alert.present();
        }
    }

    ionViewWillEnter() {
        this.drill = this.shootingService.selectedDrill;
        this.countupTimerService.stopTimer();
        this.countupTimerService.setTimervalue(0);
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
                                this.hitNohitService.updateHistory();
                                this.initStats();
                                this.bleService.resetShots();
                                this.stats = [];
                            });
                        }
                    },
                    {
                        text: 'No',
                        cssClass: 'secondary',
                        handler: (blah) => {
                            this.ngZone.runGuarded(() => {
                                this.initStats();
                                this.bleService.resetShots();
                                this.stats = [];
                            });
                        }
                    }
                ]
            });
            await alert.present();
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




    onReconnect() {
        this.bleService.connect(this.bleService.currentTargetId);
    }

    onGoBack() {

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
                clearInterval(interval);
            }
        }, 1000);
    }
}
