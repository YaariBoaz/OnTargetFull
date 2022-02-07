import {HistoryValueItemReccomendationModel, HistoryValueItemShotModel} from './HistoryModel';
import {DrillType} from '../../tab2/tab2.page';
import {ShotItem} from '../drill/constants';

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

export interface DrillModelHitNoHit {
    date: string;
    day: string;
    numericSplitAvg: number;
    hits: number;
    totalShots: number;
    range: number;
    points: number;
    userId: string;
    splitItems: string[];
    shotItems: ShotItem[];
    challngeId?: string;
}
