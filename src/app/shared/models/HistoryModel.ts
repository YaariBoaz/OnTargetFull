export interface HistoryModel {
    key: string;
    value: HistoryValueModel;
}

export interface HistoryValueModel {
    data: Array<HistoryValueItemModel>;
    day: string;
}

export interface HistoryValueItemModel {
    avgDistanceFromCenter: number;
    date: string;
    day: string;
    drillType: string;
    points: number;
    range: number;
    recommendation: HistoryValueItemReccomendationModel;
    shots: Array<HistoryValueItemShotModel>;
    splitAvg: string;
    stata: Array<HistoryValueItemStatsodel>;
    timeLimit: string;
    totalShots: number;
    summaryObject: any;
}


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
