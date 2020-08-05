import {ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ShootingService} from '../services/shooting.service';
import {DrillObject} from '../../tab2/tab2.page';
import {StorageService} from '../services/storage.service';
import {Subscription, timer} from 'rxjs';
import {countUpTimerConfigModel, CountupTimerService, timerTexts} from 'ngx-timer';
import {DashboardModel} from '../models/dashboard-model';
import {DrillModel} from '../models/DrillModel';
import {UserService} from '../services/user.service';
import {ApiService} from '../services/api.service';
import {BleService} from '../services/ble.service';
import {HitNohitService} from './hit-nohit.service';
import {Router} from '@angular/router';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';


@Component({
    selector: 'app-session-modal',
    templateUrl: './drill.component.html',
    styleUrls: ['./drill.component.scss'],
})
export class DrillComponent implements OnInit, OnChanges, OnDestroy {

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

    constructor(
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
        public alertController: AlertController,
        private hitNohitService: HitNohitService
    ) {

        this.drill = this.shootingService.selectedDrill;
        this.hitNohitService.setDrill(this.drill);
        this.hitNohitService.initStats();
        this.setTimeElapse();
    }

    ngOnInit() {
        this.hitNohitService.hitArrived.subscribe((data) => {
            if (data !== null) {
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

    onBackPressed() {
        this.initStats();
        this.router.navigateByUrl('/home/tabs/tab2/select2');
    }

    ionViewWillEnter() {
        this.drill = this.shootingService.selectedDrill;
        this.countupTimerService.stopTimer();
        this.countupTimerService.setTimervalue(0);
        this.initStats();
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


    restartShooting() {
        this.initStats();
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
}
