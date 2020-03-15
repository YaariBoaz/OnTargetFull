// import {ChartDataSets} from 'chart.js';

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
    data: Array<Array<number>>;
    percentage: number;

    constructor(props) {
        this.percentage = 0;
    }

}

export class RateOfFireChart {
    bestRate: number;
    chartData: any;
    chartLabels: Array<string>;

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
    longestShot: number;
    avgSplit: number;
    avgDistance: number;
    lastShooting: Date;

    constructor() {
        this.longestShot = 0;
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
    recommendation?: string;

    constructor() {
        this.date = '';
        this.day = '';
        this.numberOfDrills = 0;
        this.drillType = '';
        this.hits = 0;
        this.totalShots = 0;
        this.range = 0;
        this.timeLimit = 0;
        this.points = 0;
        this.recommendation = '';
    }
}

export class DashboardModel {
    hitRatioChart: HitRatioChart;
    rateOfFireChart: RateOfFireChart;
    bestScores: BestScores;
    trainingHistory: TrainingHistory[];

    constructor() {
        this.hitRatioChart = new HitRatioChart('Hit Ratio');
        this.rateOfFireChart = new RateOfFireChart('Rate Of Fire');
        this.bestScores = new BestScores();
        this.trainingHistory = new Array<TrainingHistory>();
    }
}


