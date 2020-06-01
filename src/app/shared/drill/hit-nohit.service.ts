import {Injectable} from '@angular/core';
import {countUpTimerConfigModel, CountupTimerService, timerTexts} from 'ngx-timer';
import {ShootingService} from '../services/shooting.service';
import {DashboardModel} from '../models/dashboard-model';
import {DrillModel} from '../models/DrillModel';
import {StorageService} from '../services/storage.service';
import {DrillObject} from '../../tab2/tab2.page';
import {UserService} from '../services/user.service';
import {ApiService} from '../services/api.service';
import {tap} from 'rxjs/operators';
import {BleService} from '../services/ble.service';
import {BehaviorSubject, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HitNohitService {
    resetDrillSubject = new BehaviorSubject(false);
    drillFinished = false;
    timeConfig: any;
    shots = [];
    pageData = {
        distanceFromCenter: 0,
        splitTime: '',
        rateOfFire: 0,
        counter: 0,
        points: 0,
        lastShotTime: null,
        totalTime: {} as any
    };
    stats = [];
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
    private height: any;
    private width: any;
    drill: DrillObject;
    hitArrived = new BehaviorSubject(null);
    private lastDate = null;
    private startDate = null;

    constructor(private countupTimerService: CountupTimerService,
                private shootingService: ShootingService,
                private storageService: StorageService,
                private userService: UserService,
                private bleService: BleService,
                private apiService: ApiService) {
        this.initTime();
        this.startListening();
    }

    setDrill(drill) {
        this.drill = drill;
    }

    startListening() {
        this.bleService.notifyShotArrived.subscribe(num => {
            this.shotArrived(num);

        });
    }

    shotArrived(num) {
        if (num === 0) {
            this.countupTimerService.startTimer();
        }

        return this.updateStats(num);

    }


    initStats() {
        this.drillFinished = false;
        this.pageData.counter = 0;
        this.pageData.distanceFromCenter = 0;
        this.pageData.splitTime = '0:00';
        this.pageData.rateOfFire = 0;
        this.pageData.points = 0;
        this.pageData.totalTime = '0:00';
        this.countupTimerService.stopTimer();
        this.countupTimerService.setTimervalue(0);
        this.shots = [];
        this.drillFinished = false;
        this.shots = [];
        this.stats = [];
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

    initTime() {
        this.countupTimerService.stopTimer();
        this.countupTimerService.setTimervalue(0);

        this.timeConfig = new countUpTimerConfigModel();
        this.timeConfig.timerClass = 'test_Timer_class';
        // timer text values
        this.timeConfig.timerTexts = new timerTexts();
        this.timeConfig.timerTexts.hourText = ':'; // default - hh
        this.timeConfig.timerTexts.minuteText = ':'; // default - mm
        this.timeConfig.timerTexts.secondsText = ' '; // default - ss
    }

    updateStats(num) {
        this.pageData.counter++;
        if (!this.pageData.lastShotTime) {
            this.pageData.lastShotTime = new Date();
        }
        this.pageData.totalTime = (this.pageData.totalTime + ((new Date().getTime() - this.pageData.lastShotTime.getTime()) / 1000));
        this.pageData.lastShotTime = new Date();


        const spltTime = this.getTimeInterval(this.lastDate);
        const overAllTime = this.getTimeInterval(this.startDate);
        if (spltTime === '00:00') {
            this.lastDate = new Date();
            this.startDate = new Date();
        }
        this.lastDate = new Date();
        this.pageData.splitTime = spltTime;
        this.pageData.points += 2;
        this.stats.push({
            pageData: Object.assign({}, this.pageData),
            interval: overAllTime
        });
        let points = 0;
        let distanceFromCenter = 0;
        let split = 0;

        this.stats.forEach(stat => {
            points += 2;
            distanceFromCenter += stat.pageData.distanceFromCenter;
            const arr = spltTime.split(':');
            // tslint:disable-next-line:radix
            const leftSide = parseInt(arr[0]);
            // @ts-ignore
            const splitSum = leftSide + parseFloat(String(arr[1] * 0.01));
            split += splitSum;
        });

        const statsLength = this.stats.length;
        this.summaryObject = {
            points,
            distanceFromCenter: distanceFromCenter / statsLength,
            split: split / statsLength,
            totalTime: this.stats[statsLength - 1].interval,
            counter: this.stats[statsLength - 1].pageData.counter
        };
        let isFinish = false;
        if (this.pageData.counter >= this.shootingService.numberOfBullersPerDrill) {
            this.finishDrill();
            this.updateHistory();
            isFinish = true;
        }
        this.hitArrived.next({
            hitNumber: num + 1,
            statsData: {
                stats: this.stats,
                pageData: this.pageData,
                isFinish,
                summaryObject: this.summaryObject
            }
        });
    }


    getTimePassedOverall() {

    }

    getTimeInterval(dateToCompare) {
        if (!this.lastDate) {
            return '00:00';
        }
        const date1 = new Date();

        // @ts-ignore
        const diff = (dateToCompare - date1) * -1;

        let msec = diff;
        const hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        let mm: any = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;
        let ss: any = Math.floor(msec / 1000);
        msec -= ss * 1000;


        if (mm === 0) {
            mm = '0' + mm.toString();
        }
        if (ss < 10) {
            ss = '0' + ss;
        }
        return mm + ':' + ss;

    }

    private finishDrill() {
        this.countupTimerService.stopTimer();
        console.log('FINISH!!!!!!!!!!!!!!!!!');
    }

    private updateHistory() {
        this.drill = this.shootingService.selectedDrill;
        let updatedData: DashboardModel = this.storageService.getItem('homeData');

        if (!updatedData.trainingHistory) {
            updatedData.trainingHistory = [];
        }


        const drill: DrillModel = {
            date: new Date().toJSON(),
            drillType: this.drill.drillType,
            day: new Date().toLocaleString('en-us', {weekday: 'long'}),
            hits: this.shots.length,
            points: this.pageData.points,
            range: this.drill.range,
            recommendation: null,
            shots: this.shots,
            timeLimit: null,
            totalShots: this.drill.numOfBullets,
            userId: this.userService.getUserId(),
            avgSplit: this.summaryObject.split,
            disFromCenter: this.summaryObject.distanceFromCenter
        };


        updatedData.trainingHistory.push({
            date: new Date().toString(),
            day: new Date().toLocaleString('en-us', {weekday: 'long'}),
            drillType: this.drill.drillType,
            totalShots: this.drill.numOfBullets,
            range: this.drill.range,
            timeLimit: null,
            splitAvg: this.pageData.splitTime,
            points: this.pageData.points,
            avgDistanceFromCenter: this.pageData.distanceFromCenter,
            shots: this.shots,
            stata: this.stats,
            summaryObject: this.summaryObject,
            recommendation: null
        });

        updatedData.hitRatioChart.totalHits += this.shots.length;
        updatedData.hitRatioChart.totalShots += this.drill.numOfBullets;
        updatedData = this.updateBestResults(updatedData);

        this.storageService.setItem('homeData', updatedData);
        this.apiService.syncData(drill).subscribe(data => {
        });
    }

    private updateBestResults(updatedData) {
        if (this.pageData.distanceFromCenter > updatedData.bestScores.avgDistance) {
            updatedData.bestScores.avgDistance = this.pageData.distanceFromCenter;
        }
        if (this.drill.range > updatedData.bestScores.longestShot) {
            updatedData.bestScores.longestShot = this.drill.range;
        }
        if (this.pageData.splitTime < updatedData.bestScores.avgSplit) {
            updatedData.bestScores.avgSplit = this.pageData.splitTime;
        }
        return updatedData;
    }

    resetDrill() {
        this.resetDrillSubject.next(true);
    }
}
