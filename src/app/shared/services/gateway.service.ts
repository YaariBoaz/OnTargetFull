import {Injectable} from '@angular/core';
import {ShootingService} from './shooting.service';
import {DrillObject} from '../../tab2/tab2.page';
import {StorageService} from './storage.service';
import {BehaviorSubject} from 'rxjs';
import {CountupTimerService} from 'ngx-timer';

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
        totalTime: {} as any
    };
    private batteryPrecent: number;
    private container: any;
    hitArrived = new BehaviorSubject(null);
    summaryObject = {
        points: 0,
        distanceFromCenter: 0,
        split: 0,
        totalTime: 0,
        counter: 0
    };
    notifyShotArrivedFromGateway = new BehaviorSubject(null);

    // tslint:disable-next-line:max-line-length
    constructor(private shootingService: ShootingService, private storageService: StorageService, private countupTimerService: CountupTimerService) {
    }


    public handelShoot(parentImageHeight, parentImageWidth, data) {
        if (this.pageData.counter === 0) {
            // this.countupTimerService.startTimer();
        }
        const x = data.xCoord;
        const y = data.yCoord;

        const width = parentImageWidth;
        const height = parentImageHeight;


        const deltaX = width / 8;
        const deltaY = height / 8;


        const normalizeX = x / 8;
        const normalizeY = y / 8;


        const px = deltaX * normalizeX;
        let py = deltaY * normalizeY;
        py = py - deltaY;


        if (this.pageData.counter === this.shootingService.numberOfBullersPerDrill) {
            this.updateStats(x, y, false);
            this.finishDrill();
            this.updateHistory(parentImageHeight, parentImageWidth);
        } else {

            this.updateStats(x, y, false);
        }
        this.notifyShotArrivedFromGateway.next({x, y});
    }


    public updateHistory(parentImageHeight, parentImageWidth) {
        let updatedData = {} as any;
        updatedData = this.storageService.getItem('homeData');

        if (!updatedData.trainingHistory) {
            updatedData.trainingHistory = [];
        }
        const recommendation = this.shootingService.getRecommendation(this.shots, {
            X: parentImageWidth / 2,
            Y: parentImageHeight / 2
        });

        updatedData.trainingHistory.push({
            date: new Date().toString(),
            day: new Date().toLocaleString('en-us', {weekday: 'long'}),
            drillType: this.drill.drillType,
            totalShots: this.drill.numOfBullets,
            range: this.drill.range,
            timeLimit: null,
            points: this.pageData.points,
            shots: this.shots,
            stata: this.stats,
            recommendation
        });

        updatedData.hitRatioChart.data[0] += this.shots.length;
        updatedData.hitRatioChart.data[1] += this.drill.numOfBullets - this.shots.length;
        updatedData = this.updateBestResults(updatedData);

        this.storageService.setItem('homeData', updatedData);
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


    public updateStats(x, y, isFinish) {
        this.pageData.counter++;
        console.log('counter:', this.pageData.counter);
        const currentdist: number = parseFloat(this.calculateBulletDistanceFromCenter(x, y).toFixed(2));
        this.pageData.points += this.calcScore(currentdist);
        // tslint:disable-next-line:max-line-length
        this.pageData.distanceFromCenter = parseFloat(((this.pageData.distanceFromCenter + currentdist) / this.pageData.counter).toFixed(2));
        if (!this.pageData.lastShotTime) {
            this.pageData.lastShotTime = new Date();
        }
        this.pageData.totalTime = (this.pageData.totalTime + ((new Date().getTime() - this.pageData.lastShotTime.getTime()) / 1000));
        this.pageData.lastShotTime = new Date();

        this.pageData.splitTime = (this.countupTimerService.totalSeconds / this.pageData.counter).toFixed(2);
        this.countupTimerService.getTimerValue().subscribe((time) => {
            this.stats.push({
                pageData: Object.assign({}, this.pageData),
                interval: time.hours + ':' + time.mins + ':' + time.seconds
            });
            let points = 0;
            let distanceFromCenter = 0;
            let split = 0;

            this.stats.forEach(stat => {
                points += stat.pageData.points;
                distanceFromCenter += stat.pageData.distanceFromCenter;
                const splitArr = stat.pageData.splitTime.split('.');
                split += parseFloat(splitArr[0] + '.' + splitArr[1].substr(0, 2));
            });

            const statsLength = this.stats.length;
            this.summaryObject = {
                points: points / statsLength,
                distanceFromCenter: distanceFromCenter / statsLength,
                split: split / statsLength,
                totalTime: this.stats[statsLength - 1].interval,
                counter: this.stats[statsLength - 1].pageData.counter
            };
            this.hitArrived.next({
                statsData: {
                    stats: this.stats,
                    pageData: this.pageData,
                    isFinish,
                    summaryObject: this.summaryObject
                }
            });
        });
    }

    public finishDrill() {
        this.drillFinishedBefore = true;
        this.drillFinished = true;
        // this.countupTimerService.stopTimer();
        console.log('FINISH!!!!!!!!!!!!!!!!!');
        this.updateHistory(this.height, this.width);
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

    public hanldeBateryTime_MSG(dataArray) {
        const t = dataArray[2];
        let bTime = 0;
        if (t && t !== '') {
            // tslint:disable-next-line:radix
            bTime = parseInt(t);
        }
    }

    public handleBatteryPrecentage_MSG(dataArray) {
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
        this.batteryPrecent = bCharge;
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


}
