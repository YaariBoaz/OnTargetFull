import {HistoryValueItemReccomendationModel, HistoryValueItemShotModel} from './HistoryModel';
import {DrillType} from '../../tab2/tab2.page';

export interface DrillModel {
    date: string;
    day: string;
    drillType: DrillType;
    hits: number;
    totalShots: number;
    range: number;
    points: number;
    splitTimes: Array<string>;
    userId: string;
}
