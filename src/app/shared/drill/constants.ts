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

export interface DrillSession {
    sessionId: string;
    sessionName: string;
    sessionDateTime: string;
    users: DrillResultModel[];
}

export interface DrillResultModel {
    drillDate: Date;
    drillId: number;
    drillTitle: string;
    description: string;
    drillType: string;
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
    shotNumber: number;
    orbital: number;
    disFromCenter: string;
    time: string;
    timeSplit: string;
    isOdd: boolean;
    hitHostage: boolean;
    isHeader: boolean;
    score: number;
}

export interface HitJson {
    x: number;
    y: number;
}
