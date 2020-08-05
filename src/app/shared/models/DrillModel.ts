import {HistoryValueItemReccomendationModel, HistoryValueItemShotModel} from './HistoryModel';

export interface DrillModel {
    date: string;
    day: string;
    drillType: string;
    hits: number;
    totalShots: number;
    range: number;
    points: number;
    splitTimes: Array<string>;
    userId: string;
}
