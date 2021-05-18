import {DrillType} from '../../tab2/tab2.page';

export class ConstantData {
    static pageData = {
        distanceFromCenter: 0,
        splitTime: '',
        rateOfFire: 0,
        counter: 0,
        points: 0,
        lastShotTime: null,
        totalTime: {} as any
    };
    static DEFAULT_SUMMARY_OBJECT = {
        points: 0,
        distanceFromCenter: 0,
        split: 0,
        totalTime: 0,
        counter: 0
    };
    static summaryObject = {
        points: 0,
        distanceFromCenter: 0,
        split: 0,
        totalTime: 0,
        counter: 0
    };
    static DEFUALT_PAGE_DATE = {
        distanceFromCenter: 0,
        splitTime: '',
        rateOfFire: 0,
        counter: 0,
        points: 0,
        lastShotTime: null,
        totalTime: {} as any
    };
}

export interface ShotItem {
    disFromCenter: number;
    hitHostage: boolean;
    isHeader: boolean;
    isOdd: boolean;
    orbital: string;
    score: string;
    shotNumber: string;
    time: any;
    timeSplit: any;
}

export interface DrillInfo {
    sessionId: string;
    sessionDateTime: Date;
    userId: string;
    shotItems: ShotItem[];
    drillDate: Date;
    pointsGained: number;
    timeLimit: number;
    bulletsHit: number;
    numberOfBullets: number;
    drillTitle: string;
    maxNumberOfPoints: number;
    range: number;
    imageIdKey: any;
    imageIdFullKey: number;
    hitsWithViewAdjustments: null;
    avgDistFromCenter: number;
    description: string;
    targetId: string;
    targetIP: string;
    useMoq: boolean;
    drillType: any;
    splitAvg: any;
    numericSplitAvg: any;
    timeElapsed: any;
    recomendation: any;
    wepon: any;
    sight: any;
    ammo: any;
    realibilty: any;
    b2Drop: number;
    exposeTime: number;
    hideTime: number;
    rawHitsLocation: Hits[];
    userName: string;
    status: DrillStatus;
    hitsToPass: number;
    grouping: number;
    center: null;
    epochTime: number;
    targetType: TargetType;
    zone1Counter: number;
    zone2Counter: number;
    zone3Counter: number;
    location: any;
}


export enum DrillStatus {
    Done,
    NotCompleted,
    DidntDo,
}

export interface Hits {
    x: number;
    y: number;
}

export interface DrillResultModel {
    drillDate: Date;
    drillId: number;
    drillTitle: string;
    description: string;
    drillType: DrillType;
    userId: string;
    userName: string;
    pointsGained: number;
    timeLimit: number;
    numberOfBullets: number;
    maxNumberOfPoints: number;
    range: number;
    imageIdKey: string;
    imageIdFullKey: number;
    avgDistFromCenter: number;
    shooterId: number;
    targetId: number;
    targetIP: string;
    useMoq: boolean;
    splitAvg: number;
    timeElapsed: string;
    recommendation: string;
    weapon: string;
    sight: string;
    hits: HitJson[];
    shotItems: ShotItem[];
    images: any;
    realibilty: string;
}

export interface ShotItem {
    shotNumber: string;
    orbital: string;
    disFromCenter: number;
    time: any;
    timeSplit: any;
    isOdd: boolean;
    hitHostage: boolean;
    isHeader: boolean;
    score: string;
}

export interface HitJson {
    x: number;
    y: number;
}

export enum TargetDataEventType {
    SHOT,
    BatteryTime,
    BatteryPrecentage,
    Impact,
    SHOTMOQ
}


export enum TargetType {
    Type_128,
    Type_64,
    Type_16,
    Type_PUP
}
