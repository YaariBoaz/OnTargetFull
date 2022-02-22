// import {ChartDataSets} from 'chart.js';

import {HistoryValueItemModel, HistoryValueItemReccomendationModel} from './HistoryModel';

export class HomeModel {
    charts: Array<any>;

    constructor() {
        this.charts = new Array<any>();
    }
}

export class BaseChart {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export class HitRatioChart {
    totalHits: number;
    totalShots: number;

    constructor(totalShots, totalHits) {
        this.totalHits = totalHits;
        this.totalShots = totalShots;
    }

}

export class RateOfFireChart {
    bestRate: number;
    chartData: any;
    chartLabels: Array<string>;
    userAvg;

    constructor(props) {
        this.bestRate = 0;
        this.chartData = null;
        this.chartLabels = new Array<string>();
    }

}

export class Point {
    x: Date;
    y: number;

    constructor() {
        this.x = new Date();
        this.y = 0;
    }
}

export class BestScores {
    grouping: number;
    avgSplit: number;
    avgDistance: number;
    longestShot: number;
    lastShooting: Date;

    constructor() {
        this.grouping = 0;
        this.avgDistance = 0;
        this.avgSplit = 0;
        this.lastShooting = new Date();
    }

}

export class TrainingHistory {
    date?: string;
    day?: string;
    numberOfDrills?: number;
    drillType?: string;
    hits?: number;
    totalShots?: number;
    range?: number;
    timeLimit?: number;
    points?: number;
    splitAvg: string;
    avgDistanceFromCenter: number;
    recommendation?: HistoryValueItemReccomendationModel;

    constructor() {
        this.date = '';
        this.day = '';
        this.numberOfDrills = 0;
        this.drillType = '';
        this.hits = 0;
        this.totalShots = 0;
        this.range = 0;
        this.timeLimit = 0;
        this.splitAvg = '';
        this.points = 0;
        this.avgDistanceFromCenter;
        this.recommendation = null;
    }
}

export class DashboardModel {
    hitRatioChart: HitRatioChart;
    rateOfFireChart: RateOfFireChart;
    bestScores: BestScores;
    totalPoints: number;
    trainingHistory: HistoryValueItemModel[];

    constructor() {
        this.hitRatioChart = new HitRatioChart(0, 0);
        this.rateOfFireChart = new RateOfFireChart('Rate Of Fire');
        this.bestScores = new BestScores();
        this.trainingHistory = new Array<HistoryValueItemModel>();
    }
}


