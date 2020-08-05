export interface HistoryModel {
    key: string;
    value: HistoryValueModel;
}

export interface HistoryValueModel {
    data: Array<HistoryValueItemModel>;
    day: string;
}

export interface HistoryValueItemModel {
    avgDistFromCenter?: number;
    drillDate?: string;
    day?: string;
    drillType?: string;
    points?: number;
    range?: number;
    recommendation?: HistoryValueItemReccomendationModel;
    hits?: Array<HistoryValueItemShotModel>;
    splitAvg?: string;
    stata?: Array<HistoryValueItemStatsodel>;
    timeLimit?: string;
    totalShots?: number;
    summaryObject?: any;
    description?: string;
    drillId?: any;
    drillTitle?: string;
    numberOfBullets?: any;
    pointsGained?: any;
    realibilty?: any;
    shooterId?: number;
    shotItems?: any;
    sight?: any;
    targetId?: any;
    targetIp?: any;
    timeElapsed?: any;
    useMoq?: any;
    userId?: any;
    userName?: any;
    weapon?: any;
}

// avgDistFromCenter: 0
// description: null
// drillDate: "2020-07-10T00:00:00+00:00"
// drillId: 0
// drillTitle: null
// drillType: "Hostage"
// hits: [{x: 34, y: 16}, {x: 8, y: 8}, {x: 8, y: 16}, {x: 16, y: 16}]
// imageIdFullKey: 0
// imageIdKey: null
// images: null
// maxNumberOfPoints: 0
// numberOfBullets: 5
// pointsGained: 56
// range: 100
// realibilty: null
// recommendation: "Good Shoting"
// shooterId: 0
// shotItems: null
// sight: null
// splitAvg: 0
// targetId: 0
// targetIp: null
// timeElapsed: null
// timeLimit: 5
// useMoq: false
// userId: null
// userName: null
// weapon: null

export interface HistoryValueItemReccomendationModel {
    Probabilty: number;
    Recommendation: string;
}

export interface HistoryValueItemShotModel {
    x: number;
    y: number;
}

export interface HistoryValueItemStatsodel {
    interval: string;
    pageData: HistoryValueItemStatsItemodel;
}

export interface HistoryValueItemStatsItemodel {
    counter: number;
    distanceFromCenter: number;
    lastShotTime: string;
    points: number;
    rateOfFire: number;
    splitTime: string;
    totalTime: string;
}
