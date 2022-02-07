import {Injectable} from '@angular/core';
import {countUpTimerConfigModel, CountupTimerService, timerTexts} from 'ngx-timer';
import {ShootingService} from '../services/shooting.service';
import {DashboardModel} from '../models/dashboard-model';
import {DrillModel, DrillModelHitNoHit} from '../models/DrillModel';
import {StorageService} from '../services/storage.service';
import {DrillObject} from '../../tab2/tab2.page';
import {UserService} from '../services/user.service';
import {ApiService} from '../services/api.service';
import {tap} from 'rxjs/operators';
import {BleService} from '../services/ble.service';
import {BehaviorSubject, interval, of, Subscription} from 'rxjs';
import * as moment from 'moment';
import {GatewayService} from '../services/gateway.service';
import {ShotItem} from './constants';

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
        split: '0',
        totalTime: '0',
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

    DEFAULT_PAGE_DATA = {
        distanceFromCenter: 0,
        splitTime: '',
        rateOfFire: 0,
        counter: 0,
        points: 0,
        lastShotTime: null,
        totalTime: '00:00:00'
    };
    private firstTime: Date;
    private lastTime: Date;

    constructor(private shootingService: ShootingService,
                private storageService: StorageService,
                private userService: UserService,
                private gateway: GatewayService,
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

        this.gateway.notifyHitNoHit.subscribe(data => {
            if (!this.drillIsFinished) {
                this.updateStats(data);
            }
        });
    }

    shotArrived(num) {
        if (!this.drillIsFinished) {
            return this.updateStats(num);
        }
    }


    initStats() {
        this.stats = [];
        this.drillIsFinished = false;
        this.pageData = Object.assign(this.pageData, this.DEFAULT_PAGE_DATA);
        this.summaryObject = Object.assign(this.summaryObject, this.DEFAULT_SUMMARY_OBJECT);
        this.pageData.counter = 0;
        this.bleService.resetShots();
        this.startTimer();

    }

    startTimer() {
        // tslint:disable-next-line:no-shadowed-variable max-line-length
        const now = new Date();
        this.firstTime = now;
        this.lastTime = now;
    }


    updateStats(num) {

        this.pageData.counter++;
        // tslint:disable-next-line:max-line-length
        const now = new Date();

        const split = moment.utc(moment(now, 'DD/MM/YYYY HH:mm:ss').diff(moment(this.lastTime,
            'DD/MM/YYYY HH:mm:ss'))).format('mm:ss.SS');
        const total = moment.utc(moment(now, 'DD/MM/YYYY HH:mm:ss').diff(moment(this.firstTime,
            'DD/MM/YYYY HH:mm:ss'))).format('mm:ss.SS');
        this.finalSplits.push();
        // tslint:disable-next-line:max-line-length
        this.lastTime = new Date();

        this.pageData.totalTime = total;
        this.pageData.splitTime = split;
        this.pageData.points = 2;
        this.stats.push({pageData: Object.assign({}, this.pageData), interval: this.pageData.totalTime});


        let points = 0;
        let distanceFromCenter = 0;

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.stats.length; i++) {
            points += this.stats[i].pageData.points;
            distanceFromCenter += this.stats[i].pageData.distanceFromCenter;
        }


        this.summaryObject = {
            // @ts-ignore
            points,
            distanceFromCenter,
            split: this.getSummarySplit(this.stats, this.stats.length),
            totalTime: total,
            counter: this.stats[this.stats.length - 1].pageData.counter
        };

        let isFinish = false;
        if (this.pageData.counter >= this.shootingService.numberOfBullersPerDrill) {
            this.finishDrill();
            isFinish = true;
        }

        this.notifyHitArrived(isFinish, num);
    }

    getShotItems() {
        const shotItems: ShotItem[] = new Array();
        this.stats.forEach(stat => {
            shotItems.push({
                disFromCenter: stat.pageData.distanceFromCenter.toString(),
                hitHostage: false,
                isHeader: false,
                isOdd: false,
                orbital: '0',
                score: this.pageData.points.toString(),
                shotNumber: '0',
                time: stat.pageData.totalTime,
                timeSplit: stat.pageData.splitTime
            });
        });
        return shotItems;
    }

    updateHistory() {
        this.drill = this.shootingService.selectedDrill;
        let updatedData: any = this.storageService.getItem('homeData');
        if (!updatedData) {
            updatedData = {};
        }
        if (!updatedData.trainingHistory) {
            updatedData.trainingHistory = [];
        }

        const splits = [];
        this.stats.forEach(stat => {
            splits.push(stat.pageData.splitTime);
        });


        const drill: DrillModelHitNoHit = {
            date: new Date().toJSON(),
            day: new Date().toLocaleString('en-us', {weekday: 'long'}),
            hits: this.stats.length,
            points: this.summaryObject.points,
            range: this.drill.range,
            numericSplitAvg: this.timeStringToSeconds(this.summaryObject.split),
            totalShots: this.drill.numOfBullets,
            userId: this.userService.getUserId(),
            splitItems: splits,
            shotItems: this.getShotItems(),
        };


        updatedData.trainingHistory.push({
            drillDate: new Date().toString(),
            day: new Date().toLocaleString('en-us', {weekday: 'long'}),
            drillType: this.drill.drillType,
            totalShots: this.drill.numOfBullets,
            range: this.drill.range,
            timeLimit: null,
            splitAvg: this.pageData.splitTime,
            points: this.summaryObject.points,
            avgDistFromCenter: this.pageData.distanceFromCenter,
            hits: this.stats,
            stata: this.stats,
            summaryObject: this.summaryObject,
            recommendation: null
        });

        this.storageService.setItem('homeData', updatedData);
        this.apiService.syncDataHitNoHit(drill).subscribe(data => {
            this.apiService.getDashboardData(this.userService.getUserId()).subscribe((data1) => {
                this.storageService.setItem('homeData', data);
            });
        });

    }

    timeStringToSeconds(timeString: string): number {
        const timeArray = timeString.split(':');
        let hour = 0;
        let minutes = 0;
        const seconds = 0;
        if (timeArray[0] !== '00') {
            let time = 0;
            if (timeArray[0].charAt(0) !== '0') {
                // tslint:disable-next-line:radix
                time = parseInt(timeArray[0]);
            } else {
                // tslint:disable-next-line:radix
                time = parseInt(timeArray[0].charAt(1));
            }
            hour = time * 3600;
        }

        if (timeArray[1] !== '00') {
            let time = 0;
            if (timeArray[1].charAt(0) !== '0') {
                // tslint:disable-next-line:radix
                time = parseInt(timeArray[1]);
            } else {
                // tslint:disable-next-line:radix
                time = parseInt(timeArray[1].charAt(1));
            }
            minutes = time * 60;
        }
        return hour + minutes + seconds;
    }


    resetDrill() {

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
            const timeArray = stat.pageData.splitTime.split(':');
            return timeArray[0] + ':' + timeArray[1];
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
            split: this.getSummarySplit(this.stats, this.stats.length),
            totalTime: this.stats[statsLength - 1].interval,
            counter: this.stats[statsLength - 1].pageData.counter
        };
    }

    getSummarySplit(stats: any, statsLength: number) {
        if (stats) {
            let totalSeconds = 0;
            stats.forEach(stat => {
                const arr = stat.pageData.splitTime.split(':');
                const arr2 = arr[1].split('.');
                // tslint:disable-next-line:radix
                const minutes = parseInt(arr[0]) / 60;
                // tslint:disable-next-line:radix
                const seconds = parseInt(arr2[0]);
                // tslint:disable-next-line:radix
                const mili = parseInt(arr2[1]) / 1000;
                totalSeconds += minutes + seconds + mili;
            });
            const date = new Date(0);
            totalSeconds = totalSeconds / statsLength;
            date.setSeconds(totalSeconds); // specify value for SECONDS here
            let milisec = '0';
            if (totalSeconds % 1 !== 0) {
                milisec = totalSeconds.toString().split('.')[1];
                if (milisec.length >= 2) {
                    milisec = milisec[1] + milisec[2];
                    if (parseInt(milisec) > 60) {
                        totalSeconds += 1;
                        milisec = milisec[1];
                    }
                }
            }
            const timeString = date.toISOString().substr(11, 8);
            const finalArray = timeString.split(':');
            return finalArray[1] + ':' + finalArray[2] + '.' + milisec;
            debugger
        }
        return null;
    }

    notifyHitArrived(isFinish, num) {
        this.hitArrived.next({
            hitNumber: num,
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

