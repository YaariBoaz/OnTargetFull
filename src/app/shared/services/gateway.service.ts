import {Injectable} from '@angular/core';
import {ShootingService} from './shooting.service';
import {DrillObject, DrillType} from '../../tab2/tab2.page';
import {StorageService} from './storage.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {CountupTimerService} from 'ngx-timer';
import {ApiService} from './api.service';
import {UserService} from './user.service';
import * as moment from 'moment';
import {DrillInfo, DrillStatus, ShotItem, TargetType} from '../drill/constants';
import {InitService} from './init.service';
import {BalisticCalculatorService} from './balistic-calculator.service';

@Injectable({
    providedIn: 'root'
})
export class GatewayService {
    drillFinishedBefore = false;
    drillFinished = false;
    notifyTargetConnectedToGateway = new BehaviorSubject(null);

    height: number;
    width: number;
    notifyHitNoHit = new Subject();

    drill: DrillObject;
    shots = [];
    stats = [];
    pageData = {
        distanceFromCenter: 0,
        splitTime: '',
        rateOfFire: 0,
        counter: 0,
        points: 0,
        isBarhan: false,
        lastShotTime: null,
        totalTime: '00:00:00'
    };
    notifyTargetBattery = new Subject();
    notifyKeepAlive = new Subject();
    readonly DEFAULT_PAGE_DATA = {
        distanceFromCenter: 0,
        splitTime: '',
        rateOfFire: 0,
        counter: 0,
        isBarhan: false,
        points: 0,
        lastShotTime: null,
        totalTime: '00:00:00'
    };
    private batteryPercent: number;
    hitArrived = new Subject();
    summaryObject = {
        points: 0,
        distanceFromCenter: 0,
        split: '0',
        totalTime: '00:00:00',
        counter: 0
    };
    notifyShotArrivedFromGateway = new BehaviorSubject(null);
    drillFinishedNotify = new BehaviorSubject(null);
    lastTime;
    firstTime;
    hits = [];
    targets = [];

    constructor(private shootingService: ShootingService,
                private storageService: StorageService,
                private initService: InitService,
                private ballisticCalculatorService: BalisticCalculatorService,
                private counterUpTimerService: CountupTimerService,
                private apiService: ApiService, private userService: UserService) {
    }

    // Inits stats for drill when user starts a new drill
    initStats() {
        this.shots = [];
        this.hits = [];
        this.stats = [];
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
        this.drillFinished = false;
    }

    // Starts total time timer
    startTimer() {
        // tslint:disable-next-line:no-shadowed-variable max-line-length
        const now = new Date();
        this.firstTime = now;
        this.lastTime = now;
    }

    // When drill is finished and the user decides to save the drill
    updateHistory() {
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


        let cId = null;
        if (this.shootingService.isChallenge) {
            cId = this.shootingService.challengeId;
            cId = this.shootingService.selectedDrill.challngeId;
        }

        const hitsForServer = [];
        this.hits.forEach(item => {
            hitsForServer.push({x: item.xPos, y: item.yPos});
        })

        const drill: DrillInfo = {
            challngeId: cId,
            sessionId: this.userService.getUserId(),
            sessionDateTime: new Date(),
            userId: this.userService.getUserId(),
            shotItems: this.getShotItems(),
            drillDate: new Date(),
            pointsGained: this.summaryObject.points,
            timeLimit: 0,
            bulletsHit: this.hits.length,
            numberOfBullets: this.drill.numOfBullets,
            drillTitle: DrillType[this.drill.drillType],
            maxNumberOfPoints: 100000,
            range: this.drill.range,
            imageIdKey: '',
            imageIdFullKey: 0,
            hitsWithViewAdjustments: null,
            avgDistFromCenter: this.summaryObject.distanceFromCenter,
            description: '',
            targetId: this.storageService.getItem('slectedTarget').name,
            targetIP: '0',
            useMoq: false,
            drillType: parseInt(this.drill.drillType.toString()),
            splitAvg: this.summaryObject.split,
            numericSplitAvg: this.timeStringToSeconds(this.summaryObject.split),
            timeElapsed: this.summaryObject.totalTime,
            recomendation: '',
            wepon: this.drill.weapon,
            sight: this.drill.sight,
            ammo: this.drill.ammo,
            realibilty: '',
            b2Drop: 0,
            exposeTime: 0,
            hideTime: 0,
            rawHitsLocation: hitsForServer,
            userName: this.userService.getUser().name,
            status: DrillStatus.Done,
            hitsToPass: 0,
            grouping: parseFloat((Math.round(this.ballisticCalculatorService.grouping * 100) / 100).toFixed(2)),
            center: null,
            epochTime: 0,
            targetType: this.getTargetType(this.storageService.getItem('slectedTarget').name),
            zone1Counter: 0,
            zone2Counter: 0,
            zone3Counter: 0,
            location: null
        };

        this.apiService.syncDataGateway(drill).subscribe(() => {
            this.apiService.getDashboardData(this.userService.getUserId()).subscribe((data1) => {
                this.storageService.setItem('homeData', data1);
                this.initService.newDashboardData.next(true);
            });
        });

    }

    // Updates current active drill stats.
    updateStats(x, y, isFinish, distanceFromCenterPoints, zeroData) {
        console.log('counter:', this.pageData.counter);
        const currentdist: number = parseFloat(this.calculateBulletDistanceFromCenter(distanceFromCenterPoints.x,
            distanceFromCenterPoints.y).toFixed(2));

        this.pageData.points = this.calcScore(currentdist * 2.54);
        // tslint:disable-next-line:max-line-length
        this.pageData.distanceFromCenter = currentdist;
        if (!this.pageData.lastShotTime) {
            this.pageData.lastShotTime = new Date();
        }
        if (zeroData) {
            if (zeroData.isBarhan) {
                this.pageData.isBarhan = true;
            } else {
                this.pageData.isBarhan = true;
            }
        }

        // this.pageData.totalTime = (this.pageData.totalTime + ((new Date().getTime() - this.pageData.lastShotTime.getTime()) / 1000));
        // this.pageData.lastShotTime = new Date();


        // tslint:disable-next-line:no-shadowed-variable max-line-length
        const now = new Date();

        const split = moment.utc(moment(now, 'DD/MM/YYYY HH:mm:ss').diff(moment(this.lastTime,
            'DD/MM/YYYY HH:mm:ss'))).format('mm:ss.SS');
        const total = moment.utc(moment(now, 'DD/MM/YYYY HH:mm:ss').diff(moment(this.firstTime,
            'DD/MM/YYYY HH:mm:ss'))).format('mm:ss.SS');

        // tslint:disable-next-line:max-line-length
        this.lastTime = new Date();

        this.pageData.totalTime = total;
        this.pageData.splitTime = split;
        this.pageData.distanceFromCenter = parseFloat(this.calculateBulletDistanceFromCenter(distanceFromCenterPoints.x,
            distanceFromCenterPoints.y).toFixed(2));
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
            points,
            distanceFromCenter: this.getSummaryDistanceFromCenter(this.stats),
            split: this.getSummarySplit(this.stats, statsLength),
            totalTime: this.stats[statsLength - 1].interval,
            counter: this.stats[statsLength - 1].pageData.counter
        };

        this.hitArrived.next({
            statsData: {
                shot: {x, y},
                stats: this.stats,
                pageData: this.pageData,
                isFinish,
                summaryObject: this.summaryObject,
                zeroData
            }
        });

        // tslint:disable-next-line:max-line-length

    }

    // Notify components that drill has finished
    finishDrill() {
        this.drillFinishedBefore = true;
        this.drillFinished = true;
        this.drillFinishedNotify.next(true);
    }

    // Calculates the distance from center of the last shot.
    calculateBulletDistanceFromCenter(xT, yT): number {
        const targetId = this.storageService.getItem('slectedTarget').name;
        const targetType = this.getTargetType(targetId);
        if (targetType === TargetType.Type_128) {
            const centerX = 245;
            const centerY = 245;

            return parseFloat(((Math.sqrt(
                (Math.pow(xT - centerX, 2)) +
                (Math.pow(yT - centerY, 2))
            ) / 10) / 2.54).toFixed(1));

        } else if (targetType === TargetType.Type_64) {
            const centerX = 16.303;
            const centerY = 16.303;

            const xRelative = xT / 4 * 1.8114;
            const yRelative = yT / 4 * 1.8114;

            return parseFloat((Math.sqrt(
                (Math.pow(xRelative - centerX, 2)) +
                (Math.pow(yRelative - centerY, 2))
            ) / 2.54).toFixed(1));
        }

    }

    // Calculates the score of the last shot.
    calcScore(dis) {
        if (dis <= 2) {
            return 11;
        } else if (dis > 2 && dis <= 4) {
            return 10;
        } else if (dis > 4 && dis <= 7) {
            return 9;
        } else if (dis > 7 && dis <= 10) {
            return 8;
        } else if (dis > 10 && dis <= 14) {
            return 7;
        } else if (dis > 14 && dis <= 17.5) {
            return 6;
        } else if (dis > 17.5 && dis <= 21.5) {
            return 5;
        } else {
            return 0;
        }
    }

    // Receives the data from the ble service and parses to the correct function
    processData(input) {
        if (!this.drillFinished) {
            if (!this.shootingService.numberOfBullersPerDrill || this.pageData.counter < this.shootingService.numberOfBullersPerDrill) {
                const dataArray = input.replace('<,', '').replace(',>', '').split(',');
                this.notifyKeepAlive.next(dataArray[0]);
                const dataLength = dataArray.length;
                const primB = dataArray[1];
                switch (primB) {
                    case ('S'):
                        this.handleShot_MSG_NEW(dataArray[2], dataArray[3]);
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
                    case ('SZ'):
                        // tslint:disable-next-line:radix
                        this.notifyHitNoHit.next(parseInt(dataArray[3].split('\n')[0]));
                        break;

                    default:
                        break;

                }
            }
        }
    }

    // If gateway received a shot message
    handleShot_MSG_NEW(x, y) {

        const saveX = x;
        const saveY = y;
        const targetId = this.storageService.getItem('slectedTarget').name;
        const targetType = this.getTargetType(targetId);
        let nominalStep;
        let n;
        let xPos;
        let yPos;
        if (targetType === TargetType.Type_64) {
            xPos = Math.abs((3.75 * x - 30) - 210);
            yPos = (3.75 * y - 30);
        } else if (targetType === TargetType.Type_16) {
            nominalStep = 7;
            n = 5;
            x = 0.25 * x - n;
            y = 0.25 * y - n;
            y -= 0.5;
            x -= 0.5;
            xPos = x;
            yPos = y;
        } else { // 128
            let disPointFromCenter128 = Math.sqrt(Math.pow((245 - x), 2) + Math.pow((245 - y), 2));
            disPointFromCenter128 = disPointFromCenter128 / 10;
            if (targetId.toLowerCase().indexOf('cs') > -1) {
                // xPos = 0.7278 * x - 47.306;
                xPos = 0.58333 * x - 37.91667
                //  yPos = 0.7278 * y - 47.306;
                yPos = 0.58333 * y - 37.91667
            } else {
                xPos = 0.5955 * x - 14.886;
                yPos = 0.5955 * y - 14.886;
            }
        }
        let zeroData = {} as any;
        zeroData = this.ballisticCalculatorService.updateShot(saveX, saveY, this.hits);
        if (this.shootingService.getisZero()) {
            if (zeroData.isBarhan) {
                this.hits[this.hits.length - 1].isBarhan = true;
            } else {
                this.hits[this.hits.length - 1].isBarhan = false;
            }
        }

        const disPointFromCenter = 1.905 * Math.sqrt(Math.pow((nominalStep / 2 - x), 2) + Math.pow((nominalStep / 2 - y), 2));

        const orb = this.calcOrbital(disPointFromCenter);
        this.pageData.counter++;
        this.hits.push({xPos, yPos});
        if (this.pageData.counter > this.shootingService.numberOfBullersPerDrill) {
            console.log('Shot After Drill Finished - Ignoring It');

        } else if (this.pageData.counter === this.shootingService.numberOfBullersPerDrill) {
            // tslint:disable-next-line:radix
            this.updateStats(xPos, yPos, false, {x: parseInt(saveX), y: parseInt(saveY)}, zeroData);
            this.finishDrill();
            // this.updateHistory();
        } else {

            // tslint:disable-next-line:radix
            this.updateStats(xPos, yPos, false, {x: parseInt(saveX), y: parseInt(saveY)}, zeroData);
        }

    }

    // If gateway received a shot message
    hanldeBateryTime_MSG(dataArray) {
        const t = dataArray[2];
        let bTime = 0;
        if (t && t !== '') {
            // tslint:disable-next-line:radix
            bTime = parseInt(t);
        }
    }

    // Update battery percentage
    handleBatteryPrecentage_MSG(dataArray) {
        const targetName = dataArray[0];
        if (this.targets.indexOf(targetName) === -1) {
            this.notifyTargetConnectedToGateway.next(targetName);
            this.targets.push(targetName);
        }
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
        this.notifyTargetBattery.next(this.batteryPercent);
        console.log('[Battery Precent]: ' + bCharge);
    }

    // handle shot from impact target.
    handleImpact_MSG(dataArray) {
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

    // calculate split time.
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

    // Aggregate split time of current drill to get avg
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
                    // tslint:disable-next-line:radix
                    if (parseInt(milisec) > 60) {
                        totalSeconds += 1;
                        milisec = milisec[1];
                    }
                }
            }
            const timeString = date.toISOString().substr(11, 8);
            const finalArray = timeString.split(':');
            return finalArray[1] + ':' + finalArray[2] + '.' + milisec;
        }
        return null;
    }

    // Aggregate distance from center of current drill to get avg
    getSummaryDistanceFromCenter(stats: any[]): number {
        let avg = 0;
        stats.forEach(item => {
            avg += item.pageData.distanceFromCenter;
        });
        avg = avg / stats.length;
        return Math.round((avg + Number.EPSILON) * 100) / 100;
    }


    // generates objects for server.
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

    // Parses an mm:ss string to seconds in number.
    timeStringToSeconds(timeString: string): number {
        const timeArray = timeString.split(':');
        let hour = 0;
        const minutes = 0;
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
            const secAndMili = timeArray[1].split('.');
            return parseFloat(secAndMili[0] + '.' + secAndMili[1]);
        }
        return hour + minutes + seconds;
    }


    calcOrbital(dis: number) {
        if (dis <= 2) {
            return 0;
        } else if (dis > 2 && dis <= 4) {
            return 1;
        } else if (dis > 4 && dis <= 7) {
            return 2;
        } else if (dis > 7 && dis <= 10) {
            return 3;
        } else if (dis > 10 && dis <= 14) {
            return 4;
        } else {
            return 5;
        }
    }

    getTargetType(chosenTarget: any): TargetType {
        if (chosenTarget.indexOf('003') > -1 || chosenTarget === '004') {
            return TargetType.Type_64;
        }
        if (chosenTarget.indexOf('eMar') > -1) {
            this.initService.isGateway = false;
            return TargetType.HitNoHit;
        }
        // tslint:disable-next-line:radix
        if (chosenTarget.indexOf('c') > -1) {
            return TargetType.Type_128;
        } else if (chosenTarget.indexOf('b') > -1) {
            return TargetType.Type_64;
        } else if (chosenTarget.indexOf('a') > -1) {
            return TargetType.Type_16;
        }
        const num = parseInt(chosenTarget.split('e')[1].split('n')[0]);
        switch (num) {
            case 16:
                return TargetType.Type_16;
            case 64:
                return TargetType.Type_64;
            case 128:
                return TargetType.Type_128;
            default:
                return TargetType.Type_64;
        }
    }
}
