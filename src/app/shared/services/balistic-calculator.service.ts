import {Injectable} from '@angular/core';
import {ShootingService} from './shooting.service';
import {Subject, Observable} from 'rxjs';
import {ApiService, ZeroTableGetObject} from './api.service';
import {InitService} from './init.service';
import {StorageService} from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class BalisticCalculatorService {
    grouping;
    mNumShots = 0;
    mZeroHits = new Array<ZeroHitData>();
    uiZeroShots = new Array<ZeroHitData>();
    divHeight = 300;
    divWidth = 300;
    moa = 0;
    private targetType: TargetType;
    notifyZeroShot = new Subject();
    private sessionHits = [];

    constructor(private shootingService: ShootingService,
                private storageService: StorageService,
                private apiService: ApiService,
                private initService: InitService) {
        this.divHeight = this.initService.screenH;
        this.divWidth = this.initService.screenW;
        this.getZeroTableInit();


        this.divWidth = this.initService.screenW;
        this.divHeight = this.initService.screenH;

        if (this.divWidth > this.divHeight) {
            this.divWidth = this.divHeight - 100;
        } else {
            this.divHeight = this.divWidth - 100;
        }

    }


    resetStats() {
        this.mZeroHits = new Array<ZeroHitData>();
        this.uiZeroShots = new Array<ZeroHitData>();
        this.mNumShots = 0;
    }

    getCentroid(hits) {
        let totalX = 0;
        let totalY = 0;

        hits.forEach((hit) => {
            totalX += hit.x;
            totalY += hit.y;
        });
        const centerX = totalX / hits.length;
        const centerY = totalY / hits.length;

        return new Hit(centerX, centerY);
    }

    calcDistance(hitA, hitB) {
        return Math.sqrt(Math.pow((hitA.x - hitB.x), 2) + Math.pow((hitA.y - hitB.y), 2));
    }

    getZeroTableInit() {
        this.getZeroTable({
            ballisticCoefficient: 0.121,
            initialVelocity: 1190,
            sightHeight: 2.5,
            zeroRange: 250,
            boreAngle: 0,
            windangle: 90,
            yIntercept: 0,
            altitude: 0,
            barometer: 29.59,
            temperature: 59,
            relativeHumidity: 0.5,
            windSpeed: 0,
            isMetric: true
        }).subscribe(data => {
            this.shootingService.zeroTable = data;
        });
    }


    standardDeviation(hits) {
        const v = this.constiance(hits);
        return Math.sqrt(v);
    }

    average(hits) {
        let total = 0;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < hits.length; i++) {
            total += hits[i].DisFromCenter;
        }
        const avg = total / hits.length;
        return avg;
    }

    constiance(hits) {
        let n = 0;
        let mean = 0;
        let M2 = 0;

        hits.forEach((hit) => {
            const x = hit.disFromCenter;
            n = n + 1;
            const delta = x - mean;
            mean = mean + delta / n;
            M2 += delta * (x - mean);
        });

        return M2 / (n - 1);
    }

    calculateGrouping(hits) {
        let maxDix = 0;
        for (let i = 0; i < hits.length; i++) {
            for (let j = 0; j < hits.length; j++) {
                if (i === j) {
                    continue;
                }

                const dis = this.calcDistance(hits[i], hits[j]);
                if (dis > maxDix) {
                    maxDix = dis;
                }
            }
        }

        return maxDix;
    }

    calcDistanceFromCenter(x, y, targetType): number {
        let nominalStep;
        let n;

        if (targetType === TargetType.Type_64) {
            nominalStep = 15;
            n = 1;
            x = 0.25 * x - n;
            y = 0.25 * y - n;
            y -= 0.5;
            x -= 0.5;
        } else if (targetType === TargetType.Type_16) {
            nominalStep = 7;
            n = 5;
            x = 0.25 * x - n;
            y = 0.25 * y - n;
            y -= 0.5;
            x -= 0.5;
        } else // case of 128 target
        {
            if (targetType === TargetType.Type_128 &&
                this.shootingService.chosenTarget === 'e128n2' ||
                this.shootingService.chosenTarget === 'e128n4') {
                nominalStep = 8;
                x = x / nominalStep;
                y = y / nominalStep;
            }
            // else
            {
                return Math.sqrt(Math.pow((245 - x), 2) + Math.pow((245 - y), 2)) / 10;
            }
        }
        return 1.905 * Math.sqrt(Math.pow((nominalStep / 2 - x), 2) + Math.pow((nominalStep / 2 - y), 2));
    }

    calcPostions(x, y) {
        const saveX = x;
        const saveY = y;
        const targetId = this.storageService.getItem('slectedTarget').name;
        const targetType = this.getTargetType(targetId);
        let nominalStep;
        let n;
        let xPos;
        let yPos;
        let is128 = false;
        if (targetType === TargetType.Type_64) {
            xPos = 4.85714 * x - 38.85714;
            yPos = 4.85714 * y - 38.85714;
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
            // 7 is half the width of the ellipse representing the bullet hit on the UI
            // we want to place the bullet in the middle of the cordination and not the left 0 position so we reduce 7
            // x = (this.width / 490) * x - 7;
            // y = (this.height / 490) * y;

            if (targetId.toLowerCase().indexOf('cs') > -1) {
                xPos = 0.7278 * x - 47.306;
                yPos = 0.7278 * y - 47.306;
            }
            if (targetId[0].toLowerCase() === 'c' && targetId[1].toLowerCase() !== 's' || targetId[0] === 'e') {
                xPos = 0.5955 * x - 14.886;
                yPos = 0.5955 * y - 14.886;
                if (targetId[0] === 'e') {
                    yPos = this.divWidth - yPos;
                }
            }
            is128 = true;
        }

        if (!is128) {
            const w = this.divWidth;
            const h = this.divHeight;
            const xStep = w / nominalStep;
            const yStep = h / nominalStep;

            xPos = w - (xStep * x);
            yPos = yStep * y;

            xPos -= 2;
            yPos -= 2;
        }
        const disPointFromCenter = 1.905 * Math.sqrt(Math.pow((nominalStep / 2 - x), 2) + Math.pow((nominalStep / 2 - y), 2));
        const data = new ZeroHitData(xPos, yPos);
        data.DisFromCenter = disPointFromCenter;
        return data;
    }

    getTargetType(chosenTarget: any): TargetType {
        if (chosenTarget === '003' || chosenTarget === '004') {
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
        // tslint:disable-next-line:radix
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

    calcNapar(doDraw, targetType) {

        // tslint:disable-next-line:prefer-const
        const range = this.shootingService.selectedDrill.range;
        let path2CM = 0.6; // this is a table that you need to build in startup  m_zeroTable[m_DrillInfo.Range].PathCM;
        path2CM = this.shootingService.zeroTable[range].pathCM;
        let dataNapar;
        const targertName = JSON.parse(localStorage.getItem('slectedTarget')).name;
        let val;
        if (targetType === TargetType.Type_128) {
             val = (this.divWidth / 2) + ((this.divWidth / 49) * path2CM);
            if (targertName === 'e128n2' || targertName === 'e128n4')// (target is 128 and the id is e128n2 or e128n4)
            {
                dataNapar = this.calcPostions(this.divWidth / 2, val);
            } else {
                const middleYPointInCM = 24.5;
                val = (middleYPointInCM - path2CM) * 10;
                const data = new ZeroHitData(this.divWidth / 2, val);
                dataNapar = data;
            }
        } else {
            val = (this.divWidth / 2) + ((this.divWidth / 30) * path2CM);
            dataNapar = this.calcPostions(this.divWidth / 2, val);
        }
        return {
            napar: dataNapar,
            yNapar: val,
            doDraw
        };
    }

    calcNapam(hits) {

        const centerHit = this.getCentroid(hits);
        const center = new ZeroHitData(centerHit.x, centerHit.y);
        let maxDisBetweenPoints = 0;

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < hits.length; i++) {
            hits[i].DisFromCenter = this.calcDistance(hits[i], center);
        }

        const std = this.standardDeviation(hits);
        const avg = this.average(hits);

        if (hits.length > 2) {
            hits.forEach((hit, i) => {
                {
                    const dr = Math.abs(hit.disFromCenter - std);
                    if (dr > avg) {
                        console.log('Found Anmoly:[{' + hit.x + '},{ ' + hit.y + '}]');
                        hit.isBarhan = true;
                        this.sessionHits[i].isBarhan = true;
                        this.sessionHits[i].DisFromCenter = hit.DisFromCenter;
                    } else {
                        hit.isBarhan = false;
                        this.sessionHits[i].DisFromCenter = hit.DisFromCenter;
                        this.sessionHits[i].isBarhan = false;
                    }
                }
                ;
            });

            const hitWithoutBarhans = hits.filter((item) => {
                return item.isBarhan === false;
            });

            maxDisBetweenPoints = this.calculateGrouping(hitWithoutBarhans);
            const newNapam = this.getCentroid(hitWithoutBarhans);

            return {
                napam: newNapam,
                grouping: maxDisBetweenPoints
            };
        } else {
            return {
                napam: centerHit,
                grouping: maxDisBetweenPoints
            };
        }
    }

    getZeroStatus(napar2napamDis, maxDisBetweenPoints) {
        if (maxDisBetweenPoints > 20) {
            return 'Scattered';
        } else {
            if (napar2napamDis < 3) {
                return 'Zeroed';
            } else {
                return 'Shoot Again';
            }
        }
    }

    calcClicks(disFromNAPARInInches, xy, range, clickMOA) {
        const normalized1MOA = (range / 100.0) * 1.26;
        const moaDistance = disFromNAPARInInches / 2.54 / normalized1MOA;
        const clicks = Math.round(moaDistance / clickMOA);
        return clicks;
    }

    setClickViews(napam, napar, devider, range, moa, targetType) {
        const napar2napamDis = this.calcDistance(new ZeroHitData(napam.napam.x, napam.napam.y), new ZeroHitData(napar.x, napar.y));
        const leftOrRightClicks = this.calcClicks(Math.abs(napam.napam.x - napar.x) / devider, 'X', range, moa);
        const upOrDownClicks = this.calcClicks(Math.abs(napam.napam.y - napar.y) / devider, 'Y', range, moa);

        let right = 0;
        let left = 0;
        let up = 0;
        let down = 0;

        if (targetType === TargetType.Type_128) {
            if (true)// (target is !![not]!! 128 and the id is e128n2 or e128n4)
            {
                if (napam.napam.x > napar.x) {
                    right = leftOrRightClicks;
                } else {
                    left = leftOrRightClicks;
                }
            } else {
                if (napam.napam.x < napar.x) {
                    right = leftOrRightClicks;
                } else {
                    left = leftOrRightClicks;
                }
            }
        } else {
            if (napam.napam.x > napar.x) {
                right = leftOrRightClicks;
            } else {
                left = leftOrRightClicks;
            }
            if (napam.napam.y > napar.y) {
                up = upOrDownClicks;
            } else {
                down = upOrDownClicks;
            }

        }


        return {
            rightClick: right,
            leftClick: left,
            upclick: up,
            downClick: down,
            isBarhan: false,
            napar2Napam: napar2napamDis,
            status: undefined,
            naparResults: undefined,
            naparView: undefined,
            napamToView: undefined
        };
    }

    calcGrouping(hits) {
        let disGroup = 0;
        const group = new ZeroHitData(0, 0);
        const nonBarahnHits = [];
        hits.forEach(item => {
            if (!item.isBarhan) {
                nonBarahnHits.push(item);
            }
        });
        const ordered: ZeroHitData[] = nonBarahnHits.sort((n1, n2) => n2.DisFromCenter - n1.DisFromCenter);
        if (ordered.length >= 2) {
            const a = new Hit(ordered[0].x, ordered[0].y);
            const b = new Hit(ordered[1].x, ordered[1].y);
            disGroup = Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)) / 10;
            let xN = 0;
            let yN = 0;

            nonBarahnHits.forEach(item => {
                xN += item.x;
                yN += item.y;
            });

            group.x = xN / nonBarahnHits.length;
            group.y = yN / nonBarahnHits.length;
        }
        const returnObject = {
            disGroup,
            hit: new Hit(group.x, group.y)
        };
        return returnObject;

    }

    updateZeroTableAndTargetUI(x, y, isBarhan, disFromCenter) {
        const data = this.calcPostions(x, y);
        // m_DrillInfo.RawHitsLocation.Add(new Hit(x, y));
        // m_DrillInfo.HitsWithViewAdjustments.Add(new Hit(data.XPosition, data.YPositon));
        const uiHitData = new ZeroHitData(data.x, data.y);
        uiHitData.isBarhan = isBarhan;
        uiHitData.DisFromCenter = disFromCenter;
        uiHitData.index = this.mNumShots;
        this.uiZeroShots.push(uiHitData);

        this.uiZeroShots.forEach((hit) => {
            const hitMatch = this.mZeroHits.find(element => element.index === hit.index);
            hit.isBarhan = hitMatch.isBarhan;
        });


        const napamToView = this.calcGrouping(this.sessionHits);
        return napamToView;
    }

    updateShot(x, y, hits) {
        // new hit arrvies
        // determent which target is this (16,64,128)
        this.sessionHits = hits;
        try {
            this.mNumShots++;
            const timesStrings = {}; // get splittime and total time for the hits
            let adjusments = 0.4688;
            let midPoint = 36;
            let devider = 1;
            const targertName = JSON.parse(localStorage.getItem('slectedTarget')).name;
            this.setTargetType(targertName);

            if (this.targetType === TargetType.Type_128) {
                adjusments = 1;
                midPoint = 245;
                devider = 10;
                if (this.targetType === TargetType.Type_128 && (targertName === 'e128n2' || targertName === 'e128n4')) {
                    x = x / 7.59;
                    y = y / 7.52;
                    adjusments = 0.4688;
                    midPoint = 36;
                    devider = 1;
                }
            }

            const naparResults = this.calcNapar(false, this.targetType);
            const naparData = new Hit((adjusments * midPoint), adjusments * naparResults.yNapar);
            const naparView = new Hit(naparResults.napar.x, naparResults.napar.y);
            const naparToCalcClikcs = new Hit(naparData.x, naparData.y);

            // Add New Hit
            const newHit = new Hit(adjusments * x, adjusments * y);
            const newZeroHit = new ZeroHitData(newHit.x, newHit.y);
            newZeroHit.index = this.mNumShots;
            this.mZeroHits.push(newZeroHit);

            // Get NAPAM

            let napamToCalcClicks = this.calcNapam(this.mZeroHits);
            let isBarhan = false;
            if (this.sessionHits[this.sessionHits.length - 1].isBarhan) {
                isBarhan = true;
            }
            if (!napamToCalcClicks) {
                napamToCalcClicks = {
                    napam: {x: 0, y: 0},
                    grouping: null
                };
            }

            const latestHitData = this.sessionHits[this.sessionHits.length - 1];
            const napamDistanceFromCenter = this.calcDistanceFromCenter(x, y, this.targetType);
            const napamToView = this.updateZeroTableAndTargetUI(latestHitData.x, latestHitData.y,
                latestHitData.isBarhan, napamDistanceFromCenter);
            const clicks = this.setClickViews(napamToCalcClicks, naparToCalcClikcs, devider,
                this.shootingService.selectedDrill.range, this.shootingService.getMOABySight(), this.targetType);
            let status;
            if (napamToCalcClicks.grouping > 10) {
                status = 'Scattered';
            } else if (napamToCalcClicks.grouping < 10 && napamToCalcClicks.grouping > 5) {
                status = 'Good Grouping';
            } else {
                status = 'Excellent';
            }
            clicks.status = status;
            clicks.isBarhan = isBarhan;
            clicks.naparResults = naparResults;
            clicks.napamToView = napamToView.hit;
            clicks.naparView = naparView;
            clicks.napar2Napam = napamToView.disGroup;
            this.grouping = clicks.napar2Napam / 2.54;
            return clicks;
            if (this.mNumShots === this.shootingService.numberOfBullersPerDrill) {
                const zeroStatus = this.getZeroStatus(clicks.napar2Napam, napamToCalcClicks.grouping);
                clicks.status = zeroStatus;
                clicks.naparResults = naparResults;
                clicks.napamToView = napamToView;
                clicks.naparView = naparView;


                return clicks;
            }
        } catch {

        }
    }

    lastShot() {
        // do your last shot logic (restart, save to db upload drill etc...)
    }

    setTargetType(name) {
        if (name === '003' || name.indexOf('64')) {
            this.targetType = TargetType.Type_64;
        } else if (name.indexOf('128') > -1) {
            this.targetType = TargetType.Type_128;
        } else {
            this.targetType = TargetType.Type_16;
        }
    }

    onControlLoaded() {
        this.calcNapar(true, TargetType.Type_128);
    }


    getZeroTable(data: ZeroTableGetObject): Observable<any> {
        return this.apiService.getZeroTable(data);
    }

    getCaliberMapping(): Observable<any> {
        return this.apiService.getCaliberMapping();
    }

    getCalibersTable(): Observable<any> {
        return this.apiService.getCalibersTable();
    }

    getWepons(): Observable<any> {
        return this.apiService.getWepons();
    }

    getSightsZeroing(): Observable<any> {
        return this.apiService.getSightsZeroing();
    }

    getBullets(): Observable<any> {
        return this.apiService.getBullets();
    }


    getBallisticData(weaponName, sightName) {
        return this.apiService.getBallisticData(weaponName, sightName);
    }
}

class ZeroHitData {

    x: number;
    y: number;
    index: number;
    DisFromCenter: number;
    isBarhan: boolean;

    constructor(xPos: number, yPos: number) {
        this.x = xPos;
        this.y = yPos;
        this.isBarhan = false;
    }
}

class Hit {

    x: number;
    y: number;

    constructor(xPos: number, yPos: number) {
        this.x = xPos;
        this.y = yPos;
    }
}

export enum TargetType {
    Type_128,
    Type_64,
    Type_16,
    Type_PUP,
    HitNoHit
}
