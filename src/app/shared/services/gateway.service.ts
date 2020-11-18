import {Injectable} from '@angular/core';
import {ShootingService} from './shooting.service';
import {DrillObject} from '../../tab2/tab2.page';
import {StorageService} from './storage.service';
import {BehaviorSubject} from 'rxjs';
import {CountupTimerService} from 'ngx-timer';
import {DrillModel} from '../models/DrillModel';
import {ApiService} from './api.service';
import {UserService} from './user.service';
import * as moment from 'moment';
import {now} from 'moment';
import {DrillResultModel, DrillSession, ShotItem} from '../drill/constants';
import {InitService} from './init.service'; // add this 1 of 4

@Injectable({
    providedIn: 'root'
})
export class GatewayService {
    drillFinishedBefore = false;
    drillFinished = false;


    height: number;
    width: number;


    drill: DrillObject;
    shots = [];
    stats = [];
    pageData = {
        distanceFromCenter: 0,
        splitTime: '',
        rateOfFire: 0,
        counter: 0,
        points: 0,
        lastShotTime: null,
        totalTime: '00:00:00'
    };
    DEFAULT_PAGE_DATA = {
        distanceFromCenter: 0,
        splitTime: '',
        rateOfFire: 0,
        counter: 0,
        points: 0,
        lastShotTime: null,
        totalTime: '00:00:00'
    };
    private batteryPercent: number;
    hitArrived = new BehaviorSubject(null);
    summaryObject = {
        points: 0,
        distanceFromCenter: 0,
        split: '0',
        totalTime: '00:00:00',
        counter: 0
    };
    notifyShotArrivedFromGateway = new BehaviorSubject(null);

    // tslint:disable-next-line:max-line-length
    drillFinishedNotify = new BehaviorSubject(null);
    lastTime;
    firstTime;
    hits = [];

    constructor(private shootingService: ShootingService,
                private storageService: StorageService,
                private initService: InitService,
                private countupTimerService: CountupTimerService,
                private apiService: ApiService, private userService: UserService) {
    }


    initStats() {
        this.shots = [];
        this.hits = [];
        this.stats = [];
        this.drillFinished = false;
        this.pageData = this.DEFAULT_PAGE_DATA;
        this.startTimer();
        this.hitArrived.next({
            statsData: {
                shot: null,
                stats: [],
                pageData: null,
                isFinish: false,
                summaryObject: null
            }
        });

    }

    startTimer() {
        // tslint:disable-next-line:no-shadowed-variable max-line-length
        const now = new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
        this.firstTime = now;
        this.lastTime = now;
    }

    public handelShoot(parentImageHeight, parentImageWidth, data) {

        const x = data.xCoord;
        const y = data.yCoord;

        const nominalStep = 8;
        const width = parentImageWidth;
        const height = parentImageHeight;

        const deltaX = width / nominalStep;
        const deltaY = height / nominalStep;

        const widthCorrection = (0.0628 * width - 7.6862);
        const heigthCorrection = (-0.0628 * height - 8.3138);

        const xPos = (width - (deltaX * (x / nominalStep))) + widthCorrection;
        const yPos = ((deltaY * (y / nominalStep))) + heigthCorrection;


        this.pageData.counter++;
        this.hits.push({xPos, yPos});

        if (this.pageData.counter > this.shootingService.numberOfBullersPerDrill) {
            console.log('Shot After Drill Finished - Ignoring It');

        } else if (this.pageData.counter === this.shootingService.numberOfBullersPerDrill) {
            this.updateStats(xPos, yPos, false, {x, y});
            this.finishDrill();
            this.updateHistory();
        } else {

            this.updateStats(xPos, yPos, false, {x, y});
        }
    }


    public updateHistory() {
        this.drill = this.shootingService.selectedDrill;
        let updatedData = this.storageService.getItem('homeData');
        if (!updatedData) {
            updatedData = {};
        }
        if (!updatedData.trainingHistory) {
            updatedData.trainingHistory = [];
        }
        const splits = [];
        this.stats.forEach(item => {
            splits.push(item.pageData.splitTime);
        });
        // const recommendation = this.shootingService.getRecommendation(this.shots, {
        //     X: parentImageWidth / 2,
        //     Y: parentImageHeight / 2
        // });


        const drill: DrillSession = {
            sessionId: this.userService.getUserId(),
            sessionName: this.drill.drillType,
            sessionDateTime: new Date().toString(),
            users: this.getUserModelObject()
        };

        this.apiService.syncDataGateway(drill).subscribe(() => {
            this.apiService.getDashboardData(this.userService.getUserId()).subscribe((data1) => {
                this.storageService.setItem('homeData', data1);
                this.initService.newDashboardData.next(true);
            });
        });

    }


    public updateBestResults(updatedData) {
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


    public updateStats(x, y, isFinish, distanceFromCenterPoints) {

        console.log('counter:', this.pageData.counter);
        const currentdist: number = parseFloat(this.calculateBulletDistanceFromCenter(distanceFromCenterPoints.x,
            distanceFromCenterPoints.y).toFixed(2));
        this.pageData.points += this.calcScore(currentdist);
        // tslint:disable-next-line:max-line-length
        this.pageData.distanceFromCenter = parseFloat(((this.pageData.distanceFromCenter + currentdist) / this.pageData.counter).toFixed(2));
        if (!this.pageData.lastShotTime) {
            this.pageData.lastShotTime = new Date();
        }


        // this.pageData.totalTime = (this.pageData.totalTime + ((new Date().getTime() - this.pageData.lastShotTime.getTime()) / 1000));
        // this.pageData.lastShotTime = new Date();


        // tslint:disable-next-line:no-shadowed-variable max-line-length
        const now = new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();

        const split = moment.utc(moment(now, 'DD/MM/YYYY HH:mm:ss').diff(moment(this.lastTime,
            'DD/MM/YYYY HH:mm:ss'))).format('HH:mm:ss');
        const total = moment.utc(moment(now, 'DD/MM/YYYY HH:mm:ss').diff(moment(this.firstTime,
            'DD/MM/YYYY HH:mm:ss'))).format('HH:mm:ss');

        // tslint:disable-next-line:max-line-length
        this.lastTime = new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();

        this.pageData.totalTime = total;
        this.pageData.splitTime = split;
        this.pageData.distanceFromCenter = Math.round((this.calculateBulletDistanceFromCenter(distanceFromCenterPoints.x,
            distanceFromCenterPoints.y) + Number.EPSILON) * 100) / 100;
        this.stats.push({
            pageData: Object.assign({}, this.pageData),
            interval: this.pageData.totalTime
        });


        let points = 0;
        let distanceFromCenter = 0;

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.stats.length; i++) {
            points += this.stats[i].pageData.points;
            distanceFromCenter += this.stats[i].pageData.distanceFromCenter;
        }


        const statsLength = this.stats.length;
        this.summaryObject = {
            points: Math.round(points / statsLength),
            distanceFromCenter: this.getSummaryDistanceFromCenter(this.stats),
            split: this.getSummarySplit(this.pageData.totalTime, statsLength),
            totalTime: this.stats[statsLength - 1].interval,
            counter: this.stats[statsLength - 1].pageData.counter
        };

        this.hitArrived.next({
            statsData: {
                shot: {x, y},
                stats: this.stats,
                pageData: this.pageData,
                isFinish,
                summaryObject: this.summaryObject
            }
        });

        // tslint:disable-next-line:max-line-length

    }

    public finishDrill() {
        this.drillFinishedBefore = true;
        this.drillFinished = true;
        this.drillFinishedNotify.next(true);
    }

    public calculateBulletDistanceFromCenter(xT, yT): number {
        // Calculate distance from center:
        // Get number of sensor on the X axis:
        let xSensorNumber = -1.0;
        let xDistanceFromCenter = -1.0;
        if (xT % 8 === 0) {
            xSensorNumber = xT / 8.0;
            if (xSensorNumber <= 4) {
                xDistanceFromCenter = Math.abs(xSensorNumber - 4) * 3.6 + 3.6 / 2;
            } else {
                xDistanceFromCenter = Math.abs(xSensorNumber - 4) * 3.6 - 3.6 / 2;
            }

        } else if (xT % 4 === 0) {
            xSensorNumber = Math.floor(xT / 8.0);
            xDistanceFromCenter = Math.abs(xSensorNumber - 4) * 3.6;
        } else {
            // Resh:
            xSensorNumber = Math.round(xT / 8.0);
            if (xT < 8.0 * xSensorNumber) {
                if (xSensorNumber <= 4) {
                    xDistanceFromCenter = 1 + Math.abs(xSensorNumber - 4) * 3.6 + 3.6 / 2;
                } else {
                    xDistanceFromCenter = Math.abs(xSensorNumber - 4) * 3.6 + 3.6 / 2 - 1;
                }
            } else {
                if (xSensorNumber <= 4) {
                    xDistanceFromCenter = Math.abs(xSensorNumber - 4) * 3.6 + 3.6 / 2 - 1;
                } else {
                    xDistanceFromCenter = Math.abs(xSensorNumber - 4) * 3.6 + 3.6 / 2 + 1;
                }

            }
        }
        let ySensorNumber = -1.0;
        let yDistanceFromCenter = -1.0;
        if (yT % 8 === 0) {
            ySensorNumber = yT / 8.0;
            if (ySensorNumber <= 4) {
                yDistanceFromCenter = Math.abs(ySensorNumber - 4) * 3.6 + 3.6 / 2;
            } else {
                yDistanceFromCenter = Math.abs(ySensorNumber - 4) * 3.6 - 3.6 / 2;
            }

        } else if (yT % 4 === 0) {
            ySensorNumber = Math.floor(yT / 8.0);
            yDistanceFromCenter = Math.abs(ySensorNumber - 4) * 3.6;
        } else {
            // Resh:
            Math.round(yT / 8.0);
            if (yT < 8.0 * ySensorNumber) {
                if (ySensorNumber <= 4) {
                    yDistanceFromCenter = 1 + Math.abs(ySensorNumber - 4) * 3.6 + 3.6 / 2;
                } else {
                    yDistanceFromCenter = Math.abs(ySensorNumber - 4) * 3.6 + 3.6 / 2 - 1;
                }
            } else {
                if (ySensorNumber <= 4) {
                    yDistanceFromCenter = Math.abs(ySensorNumber - 4) * 3.6 + 3.6 / 2 - 1;
                } else {
                    yDistanceFromCenter = Math.abs(ySensorNumber - 4) * 3.6 + 3.6 / 2 + 1;
                }

            }
        }

        if (xSensorNumber <= 4) {
            xDistanceFromCenter = -1 * xDistanceFromCenter;
        }

        if (ySensorNumber <= 4) {
            yDistanceFromCenter = -1 * yDistanceFromCenter;
        }
        return Math.sqrt(Math.pow(xDistanceFromCenter, 2) + Math.pow(yDistanceFromCenter, 2));

    }

    public calcScore(dis) {
        if (dis < 5) {
            return 1;
        } else if (dis >= 5 && dis < 10) {
            return 2;
        } else if (dis >= 10 && dis < 15) {
            return 3;
        } else if (dis >= 15 && dis < 20) {
            return 4;
        } else if (dis >= 20 && dis < 25) {
            return 5;
        } else {
            return 6;
        }
    }

    public processData(input) {
        const dataArray = input.replace('<,', '').replace(',>', '').split(',');
        const dataLength = dataArray.length;
        if (dataLength === 4) {
            const primB = dataArray[1];
            switch (primB) {
                case ('S'):
                    this.handleShot_MSG(dataArray);
                    break;
                case ('T'):
                    this.hanldeBateryTime_MSG(dataArray);
                    break;
                case ('B'):
                    this.handleBatteryPrecentage_MSG(dataArray);
                    break;
                case ('I'):
                    this.handleImpact_MSG(dataArray);
                    break;
                default:
                    break;

            }
        } else {
            console.error('ProcessData Invalid: {0}, Not 4 Length', input);
        }
    }

    // Parses X/Y to normal state
    public handleShot_MSG(dataArray) {
        const targetName = dataArray[0];
        const target = this.storageService.getItem('slectedTarget');
        if (targetName === target.name) {
            const x = dataArray[2];
            let xCoord = 0;
            if (x && x !== '') {
                xCoord = parseFloat(x);
            }
            const y = dataArray[3];
            let yCoord = 0;
            if (y && y !== '') {
                yCoord = parseFloat(dataArray[3]);
            }
            this.handelShoot(this.height, this.width, {xCoord, yCoord});
        }
    }

    public hanldeBateryTime_MSG(dataArray) {
        const t = dataArray[2];
        let bTime = 0;
        if (t && t !== '') {
            // tslint:disable-next-line:radix
            bTime = parseInt(t);
        }
    }

    public handleBatteryPrecentage_MSG(dataArray) {
        const targetName = dataArray[0];
        const b = dataArray[2];
        let heartRate = 0;
        if (b && b !== '') {
            heartRate = parseFloat(b);
        }
        let bCharge = heartRate - 6;
        bCharge = (bCharge / 2.4) * 100;
        if (bCharge > 100) {
            bCharge = 100;
        } else if (bCharge < 0) {
            bCharge = 1;
        }
        this.batteryPercent = bCharge;
        console.log('[Battery Precent]: ' + bCharge);
    }

    public handleImpact_MSG(dataArray) {
        const i1 = dataArray[2];
        let byte1 = 0;
        {
            // tslint:disable-next-line:radix
            byte1 = parseInt(i1);
        }
        const i2 = dataArray[3];
        let byte2 = 0;
        if (i2 && i2 !== '') {
            // tslint:disable-next-line:radix
            byte2 = parseInt(i2);
        }
        const deviceImpacts = byte1 * 56 + byte2;
        this.storageService.setItem('target-impacts', deviceImpacts);
    }


    getTimeDiffrence(str1, str2) {
        console.log('In getTimeDifference: first STR: ' + str1 + ' second STR: ' + str2);
        const arr1 = str1.split(':');
        const arr2 = str2.split(':');
        // tslint:disable-next-line:radix
        const hoursArr1 = parseInt(arr1[0]);
        // tslint:disable-next-line:radix
        const hoursArr2 = parseInt(arr2[0]);
        // tslint:disable-next-line:radix
        const minArr1 = parseInt(arr1[1]);
        // tslint:disable-next-line:radix
        const minArr2 = parseInt(arr2[1]);
        // tslint:disable-next-line:radix
        const secArr1 = parseInt(arr1[2]);
        // tslint:disable-next-line:radix
        const secArr2 = parseInt(arr2[2]);


        let newHour = Math.abs(hoursArr1 - hoursArr2);
        let newMin = Math.abs(minArr1 - minArr2);

        let newSec = Math.abs(secArr1 - secArr2);
        if (newHour < 10) {
            newHour = ('0' + newHour) as any;
        }
        if (newMin < 10) {
            newMin = ('0' + newMin) as any;
        }
        if (newSec < 10) {
            newSec = ('0' + newSec) as any;
        }
        console.log('New Split is : ' + newHour + ':' + newMin + ':' + newSec);
        return newHour + ':' + newMin + ':' + newSec;
    }


    private getSummarySplit(timeString: any, statsLength: number) {
        const timeArray = timeString.split(':');
        let hour = 0;
        let minutes = 0;
        let seconds = 0;
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

        if (timeArray[2] !== '00') {
            let time = 0;
            if (timeArray[2].charAt(0) !== '0') {
                // tslint:disable-next-line:radix
                time = parseInt(timeArray[2]);
            } else {
                // tslint:disable-next-line:radix
                time = parseInt(timeArray[2].charAt(1));
            }
            seconds = time;
        }

        const totalSeconds = hour + minutes + seconds;

        const res = Math.round(totalSeconds / statsLength);
        if (res < 10) {
            return '00:00:0' + res;

        } else if (res >= 10 && res < 100) {
            if (res % 1 !== 0) {
                const mili = Math.round(res % 1);
                return '00:0' + Math.round(res) + ':' + mili;
            } else {
                return '00:' + Math.round(res) + ':00';
            }
        }
    }

    private getSummaryDistanceFromCenter(stats: any[]): number {
        let avg = 0;
        stats.forEach(item => {
            avg += item.pageData.distanceFromCenter;
        });
        avg = avg / stats.length;
        return Math.round((avg + Number.EPSILON) * 100) / 100;
    }

    private getUserModelObject(): DrillResultModel[] {
        const arr = new Array<DrillResultModel>();
        const shotItems: ShotItem[] = new Array();
        this.stats.forEach(stat => {
            shotItems.push({
                disFromCenter: stat.pageData.distanceFromCenter.toString(),
                hitHostage: false,
                isHeader: false,
                isOdd: false,
                orbital: 0,
                score: this.pageData.points,
                shotNumber: 0,
                time: this.pageData.totalTime,
                timeSplit: this.pageData.splitTime
            });
        });

        const item: DrillResultModel = {
            avgDistFromCenter: this.summaryObject.distanceFromCenter,
            drillDate: new Date(),
            description: '',
            drillId: 1,
            drillTitle: this.drill.drillType,
            drillType: this.drill.drillType,
            hits: this.hits,
            imageIdFullKey: 0,
            imageIdKey: '',
            images: null,
            maxNumberOfPoints: 100000,
            numberOfBullets: this.drill.numOfBullets,
            pointsGained: this.summaryObject.points,
            range: this.drill.range,
            realibilty: '',
            recommendation: '',
            shooterId: 1,
            shotItems,
            sight: this.drill.sight,
            splitAvg: this.timeStringToSeconds(this.summaryObject.split),
            targetId: 0,
            targetIP: '',
            timeElapsed: this.summaryObject.totalTime,
            timeLimit: 0,
            weapon: this.drill.weapon,
            useMoq: false,
            userId: this.userService.getUserId(),
            userName: this.userService.getUser().name

        };
        const finalArray = new Array<DrillResultModel>();
        finalArray.push(item);
        return finalArray;
    }

    private timeStringToSeconds(timeString: string): number {
        const timeArray = timeString.split(':');
        let hour = 0;
        let minutes = 0;
        let seconds = 0;
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

        if (timeArray[2] !== '00') {
            let time = 0;
            if (timeArray[2].charAt(0) !== '0') {
                // tslint:disable-next-line:radix
                time = parseInt(timeArray[2]);
            } else {
                // tslint:disable-next-line:radix
                time = parseInt(timeArray[2].charAt(1));
            }
            seconds = time;
        }

        return hour + minutes + seconds;
    }
}
