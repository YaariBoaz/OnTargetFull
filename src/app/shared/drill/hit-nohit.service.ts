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
    shots = [];
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
        this.shots = [];
        this.stats = [];
        this.summaryObject = this.DEFAULT_SUMMARY_OBJECT;
        this.drillFinished = false;
        this.shots = [];
        this.stats = [];
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
        }

        this.notifyHitArrived(isFinish, num);
    }

    updateHistory() {
        this.drill = this.shootingService.selectedDrill;
        const updatedData: DashboardModel = this.storageService.getItem('homeData');

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

        // updatedData.hitRatioChart.totalHits += this.shots.length;
        // updatedData.hitRatioChart.totalShots += this.drill.numOfBullets;
        // updatedData = this.updateBestResults(updatedData);

        this.storageService.setItem('homeData', updatedData);
        // this.apiService.syncData(drill).subscribe(data => {
        // });
    }

    resetDrill() {
        this.initStats();
        this.resetDrillSubject.next(true);
    }


    getTotalAndSplitTimes(): SplitAndTotalTime {
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

    getElapsedTime(entry: Entry): TimeSpan {
        let totalSeconds = Math.floor((new Date().getTime() - entry.created.getTime()) / 1000);

        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        if (totalSeconds >= 3600) {
            hours = Math.floor(totalSeconds / 3600);
            totalSeconds -= 3600 * hours;
        }

        if (totalSeconds >= 60) {
            minutes = Math.floor(totalSeconds / 60);
            totalSeconds -= 60 * minutes;
        }

        seconds = totalSeconds;

        if (hours < 10) {
            // @ts-ignore
            hours = '0' + hours;
        }
        if (minutes < 10) {
            // @ts-ignore
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            // @ts-ignore
            seconds = '0' + seconds;
        }
        return {
            hours,
            minutes,
            seconds
        };
    }

    startSplitInterval() {
        this.splitSubscription = interval(1000).subscribe(() => {
            const timespan: TimeSpan = this.getElapsedTime(this.splitDate);
            this.currentSplitTime = timespan.minutes + ':' + timespan.seconds;
        });
    }

    startOverallInterval() {
        this.overallSubscription = interval(1000).subscribe(() => {
            const timespan: TimeSpan = this.getElapsedTime(this.overallDate);
            this.currenOverTime = timespan.minutes + ':' + timespan.seconds;
        });
    }
}

export interface SplitAndTotalTime {
    totalTime: string;
    splitTime: string;

}


export class TimeSpan {
    hours: number;
    minutes: number;
    seconds: number;

    constructor(hours, minuts, seconds) {
        this.hours = hours;
        this.minutes = minuts;
        this.seconds = seconds;
    }

    toString() {
        return this.minutes + ':' + this.seconds;
    }
}

export interface Entry {
    created: Date;
    id: string;
}

