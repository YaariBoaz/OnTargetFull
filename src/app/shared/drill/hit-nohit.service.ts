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
import {BehaviorSubject, interval, of, Subscription} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HitNohitService {
    resetDrillSubject = new BehaviorSubject(false);
    drillFinished = false;
    timeConfig: any;
    DEFUALT_PAGEDATA = {
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
    drill: DrillObject;
    hitArrived = new BehaviorSubject(null);
    didFirstStamArrive = false;
    drillIsFinished = false;


    splitSubscription: Subscription;
    splitDate: Entry = null;
    overallSubscription: Subscription;
    overallDate: Entry = null;
    currentSplitTime: string;
    currenOverTime: string;
    doubleSplits = [];
    finalSplits = [];
    drillFinishedNotify = new BehaviorSubject(null);

    constructor(private shootingService: ShootingService,
                private storageService: StorageService,
                private userService: UserService,
                private bleService: BleService,
                private apiService: ApiService) {
        this.startListening();
    }

    setDrill(drill) {
        this.drill = drill;
    }

    startListening() {
        this.bleService.notifyShotArrived.subscribe(num => {
            if (this.didFirstStamArrive) {
                this.shotArrived(num);
            } else {
                this.didFirstStamArrive = true;
            }
        });
    }

    shotArrived(num) {
        if (!this.drillIsFinished) {
            return this.updateStats(num);
        }
    }


    initStats() {
        this.pageData.counter = 0;
        this.drillIsFinished = false;
        this.stats = [];
        this.summaryObject = this.DEFAULT_SUMMARY_OBJECT;
        this.drillFinished = false;
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

    }

    updateStats(num) {
        this.pageData.counter++;
        if (num === 0) {
            this.splitDate = {
                created: new Date(),
                id: 'split'
            };
            this.overallDate = {
                created: new Date(),
                id: 'overall'
            };
            this.createFirstShotData();
            this.startSplitInterval();
            this.startOverallInterval();
        } else {
            const totalAndSplitTime: SplitAndTotalTime = this.getTotalAndSplitTimes();
            console.log('Inside updateStats totalAndSplitTime is: ', totalAndSplitTime);
            if (!totalAndSplitTime.splitTime || !totalAndSplitTime.totalTime) {
                totalAndSplitTime.splitTime = '00:00';
                totalAndSplitTime.totalTime = '00:00';
            }
            this.pageData.totalTime = totalAndSplitTime.totalTime;
            this.pageData.splitTime = totalAndSplitTime.splitTime;
            this.pageData.points += 2;
            this.stats.push({pageData: Object.assign({}, this.pageData), interval: this.pageData.totalTime});
            this.splitDate = {
                created: new Date(),
                id: 'split'
            };
            console.log('Inside updateStats pageData is: ', this.pageData);
        }

        this.handleSummaryData();

        let isFinish = false;
        if (this.pageData.counter >= this.shootingService.numberOfBullersPerDrill) {
            this.finishDrill();
            this.updateHistory();
            isFinish = true;
            this.drillFinishedNotify.next(true);
        }

        this.notifyHitArrived(isFinish, num);
    }

    updateHistory() {
        this.drill = this.shootingService.selectedDrill;
        const updatedData: DashboardModel = this.storageService.getItem('homeData');

        if (!updatedData.trainingHistory) {
            updatedData.trainingHistory = [];
        }

        const splits = [];
        this.stats.forEach(stat => {
            splits.push(stat.pageData.splitTime);
        });


        const drill: DrillModel = {
            date: new Date().toJSON(),
            drillType: this.drill.drillType,
            day: new Date().toLocaleString('en-us', {weekday: 'long'}),
            hits: this.stats.length,
            points: this.pageData.points,
            range: this.drill.range,
            splitTimes: this.finalSplits,
            totalShots: this.drill.numOfBullets,
            userId: this.userService.getUserId(),
        };


        updatedData.trainingHistory.push({
            drillDate: new Date().toString(),
            day: new Date().toLocaleString('en-us', {weekday: 'long'}),
            drillType: this.drill.drillType,
            totalShots: this.drill.numOfBullets,
            range: this.drill.range,
            timeLimit: null,
            splitAvg: this.pageData.splitTime,
            points: this.pageData.points,
            avgDistFromCenter: this.pageData.distanceFromCenter,
            hits: this.stats,
            stata: this.stats,
            summaryObject: this.summaryObject,
            recommendation: null
        });

        this.storageService.setItem('homeData', updatedData);
        this.apiService.syncData(drill).subscribe(data => {
            this.apiService.getDashboardData(this.userService.getUserId()).subscribe((data1) => {
                this.storageService.setItem('homeData', data1);
            });
        });

    }

    resetDrill() {
        this.initStats();
        this.resetDrillSubject.next(true);
    }


    getTotalAndSplitTimes(): SplitAndTotalTime {
        const obj = this.doubleSplits.find(o => o.str === this.currentSplitTime);
        this.finalSplits.push(obj.mili);
        return {
            splitTime: this.currentSplitTime,
            totalTime: this.currenOverTime
        };
    }

    createFirstShotData() {
        this.pageData.totalTime = '00:00';
        this.pageData.lastShotTime = new Date();
        this.pageData.splitTime = '00:00';
        const overAllTime = '00:00';
        this.stats.push({
            pageData: Object.assign({}, this.pageData),
            interval: overAllTime
        });
        console.log('Inside createFirstShotData pageData is: ', this.pageData);
    }

    finishDrill() {
        this.drillIsFinished = true;
    }

    handleSummaryData() {
        let points = 0;
        let distanceFromCenter = 0;
        let split = 0;
        this.stats.forEach(stat => {
            points += 2;
            distanceFromCenter += stat.pageData.distanceFromCenter;
            const arr = stat.pageData.splitTime.split(':');
            // tslint:disable-next-line:radix
            const leftSide = parseInt(arr[0]);
            // @ts-ignore
            const splitSum = leftSide + parseFloat(String(arr[1] * 0.01));
            split += splitSum;
        });

        const statsLength = this.stats.length;
        let finalSplit = split / statsLength;
        // @ts-ignore
        finalSplit = parseFloat(finalSplit).toFixed(2);
        // @ts-ignore
        finalSplit = '0' + finalSplit;

        this.summaryObject = {
            points,
            distanceFromCenter: distanceFromCenter / statsLength,
            split: finalSplit,
            totalTime: this.stats[statsLength - 1].interval,
            counter: this.stats[statsLength - 1].pageData.counter
        };
    }

    notifyHitArrived(isFinish, num) {
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

    getElapsedTime(entry: Entry): string {
        const duration: any = new Date().getTime() - entry.created.getTime();

        // tslint:disable-next-line:radix
        const milliseconds: any = parseInt(String((duration % 1000) / 100));
        let seconds: any = Math.floor((duration / 1000) % 60);
        let minutes: any = Math.floor((duration / (1000 * 60)) % 60);
        let hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        this.doubleSplits.push({mili: duration, str: minutes + ':' + seconds + '.' + milliseconds});
        return minutes + ':' + seconds + '.' + milliseconds;

    }

    startSplitInterval() {
        this.splitSubscription = interval(100).subscribe(() => {
            const timespan = this.getElapsedTime(this.splitDate);
            this.currentSplitTime = timespan;
        });
    }

    startOverallInterval() {
        this.overallSubscription = interval(1000).subscribe(() => {
            const timespan = this.getElapsedTime(this.overallDate);
            this.currenOverTime = timespan;
        });
    }
}

export interface SplitAndTotalTime {
    totalTime: string;
    splitTime: string;

}


export class TimeSpan {
    minutes: number;
    seconds: number;
    milliseconds: number;

    constructor(minuts, seconds, milliseconds) {
        this.minutes = minuts;
        this.seconds = seconds;
        this.milliseconds = milliseconds;
    }

    toString() {
        return this.minutes + ':' + this.seconds;
    }
}

export interface Entry {
    created: Date;
    id: string;
}

