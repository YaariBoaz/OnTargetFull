import {HistoryValueItemReccomendationModel, HistoryValueItemShotModel} from './HistoryModel';

export interface DrillModel {
    date: string;
    day: string;
    drillType: string;
    hits: number;
    totalShots: number;
    range: number;
    timeLimit: string;
    points: number;
    recommendation: HistoryValueItemReccomendationModel;
    shots: Array<HistoryValueItemShotModel>;
    userId: string;
    avgSplit: number;
    disFromCenter: number;
}
