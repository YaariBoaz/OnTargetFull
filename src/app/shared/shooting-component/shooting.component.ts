import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ShootingService} from '../services/shooting.service';
import {DrillObject} from '../../tab2/tab2.page';
import {StorageService} from '../services/storage.service';
import {Subscription, timer} from 'rxjs';
import {CountupTimerService} from 'ngx-timer';


@Component({
    selector: 'app-session-modal',
    templateUrl: './shooting.component.html',
    styleUrls: ['./shooting.component.scss'],
})
export class ShootingComponent implements OnInit, OnChanges, OnDestroy {

    @Input() isHistory = false;
    @Input() historyDrill: DrillObject;
    @ViewChild('container', {static: false}) container: ElementRef;
    @ViewChild('screen', {static: false}) screen: ElementRef;
    @ViewChild('canvas', {static: false}) canvas: ElementRef;
    @ViewChild('downloadLink', {static: false}) downloadLink: ElementRef;
    shots = [];
    drill: DrillObject;
    testConfig: any;

    BASE_URL = '192.168.0.';

    socket: WebSocket;

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
    private chosenTarget: any;
    private interval;
    private subscription: Subscription;
    stats = [];
    batteryPrecent;
    isConnected = false;
    drillFinishedBefore = false;


    constructor(
        private storageService: StorageService,
        private shootingService: ShootingService,
        private countupTimerService: CountupTimerService
    ) {
        this.drill = this.shootingService.selectedDrill;
        this.setTimeElapse();
        this.BASE_URL += this.shootingService.chosenTarget;
        if (this.shootingService.BaseUrl) {
            this.BASE_URL = this.shootingService.getBaseUrl();
        }
    }

    ngOnInit() {
        this.initConnection(this.shootingService.chosenTarget);

    }

    // It will start running only on the first shot.
    setTimeElapse() {
        // this.countupTimerService.stopTimer();
        // this.countupTimerService.setTimervalue(0);
        //
        // this.testConfig = new countUpTimerConfigModel();
        // this.testConfig.timerClass = 'test_Timer_class';
        // // timer text values
        // this.testConfig.timerTexts = new timerTexts();
        // this.testConfig.timerTexts.hourText = ':'; // default - hh
        // this.testConfig.timerTexts.minuteText = ':'; // default - mm
        // this.testConfig.timerTexts.secondsText = ' '; // default - ss
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.isHistory) {
            this.isHistory = changes.isHistory.currentValue;
        }
        if (changes && changes.historyDrill) {
            this.historyDrill = changes.historyDrill.currentValue;
        }
    }


    initConnection(chosenTarget) {
        this.chosenTarget = chosenTarget;
        if (this.shootingService.BaseUrl) {
            this.BASE_URL = this.shootingService.getBaseUrl();
        }
        this.socket = new WebSocket('ws://' + this.BASE_URL + '/ws');
        this.socket.onopen = (e) => {
            this.isConnected = true;
            console.log('[open] Connection established');
            this.socket.send('b');
            this.socket.send('t');
        };
        this.socket.onmessage = (event) => {
            console.log(`[message] ${event.data}`);
            this.processData(event.data);
        };
        this.socket.onclose = (event) => {
            if (event.wasClean) {

            } else {
                // e.g. server process killed or network down
                // event.code is usually 1006 in this case
            }
        };
        this.socket.onerror = (error) => {
        };
    }

    handelShoot(parentImageHeight, parentImageWidth, data) {
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


        this.updateStats(x, y);
        this.shots.push({x: px, y: py});

        if (this.pageData.counter === this.shootingService.numberOfBullersPerDrill) {
            this.finishDrill();
            this.updateHistory(parentImageHeight, parentImageWidth);
        }
    }

    initStats() {
        console.log('This is in the init stats of the session');
        this.drillFinished = false;
        this.pageData.counter = 0;
        this.pageData.distanceFromCenter = 0;
        this.pageData.splitTime = '0:00';
        this.pageData.rateOfFire = 0;
        this.pageData.points = 0;
        this.pageData.totalTime = '0:00';
        // this.countupTimerService.stopTimer();
        // this.countupTimerService.setTimervalue(0);
        this.shots = [];
    }


    updateStats(x, y) {
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
        });


    }

    calculateBulletDistanceFromCenter(xT, yT): number {
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

    calcScore(dis) {
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

    onBackPressed() {
        this.socket.close();
        this.initStats();
    }

    // If we returned to this screen from another tab
    ionViewWillEnter() {
        this.drill = this.shootingService.selectedDrill;
        // this.countupTimerService.stopTimer();
        // this.countupTimerService.setTimervalue(0);
        this.initStats();
    }


    // Close socket before leaving.
    ionViewDidLeave() {
        this.socket.close();
        console.log('[OnDestroy] Session Component');
    }

    ngOnDestroy() {
        this.socket.close();
        this.socket = null;
        console.log('[OnDestroy] Session Component');
    }

    // Decide what kind of message arrived and transfer it to the right function
    processData(input) {
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
    handleShot_MSG(dataArray) {
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
        if (!this.width && !this.height) {
            this.height = this.container.nativeElement.offsetHeight;
            this.width = this.container.nativeElement.offsetWidth;
        }
        this.handelShoot(this.height, this.width, {xCoord, yCoord});
    }

    hanldeBateryTime_MSG(dataArray) {
        const t = dataArray[2];
        let bTime = 0;
        if (t && t !== '') {
            // tslint:disable-next-line:radix
            bTime = parseInt(t);
        }
    }

    handleBatteryPrecentage_MSG(dataArray) {
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

    private finishDrill() {
        this.drillFinishedBefore = true;
        this.drillFinished = true;
        // this.countupTimerService.stopTimer();
        this.socket.close();
        console.log('FINISH!!!!!!!!!!!!!!!!!');
        this.updateHistory(this.height, this.width);
    }

    private updateHistory(parentImageHeight, parentImageWidth) {
        let updatedData = {} as any;
        updatedData = this.storageService.getItem('homeData');

        if (!updatedData.trainingHistory) {
            updatedData.trainingHistory = [];
        }
        const recommendation = this.shootingService.getRecommendation(this.shots, {X: parentImageWidth / 2, Y: parentImageHeight / 2});

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
            recommendation
        });

        updatedData.hitRatioChart.data[0] += this.shots.length;
        updatedData.hitRatioChart.data[1] += this.drill.numOfBullets - this.shots.length;
        updatedData = this.updateBestResults(updatedData);

        this.storageService.setItem('homeData', updatedData);
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

    restartShooting() {
        this.shots = [];
        this.pageData = this.DEFUALT_PAGE_DATE;
        this.summaryObject = this.DEFAULT_SUMMARY_OBJECT;

    }
}
