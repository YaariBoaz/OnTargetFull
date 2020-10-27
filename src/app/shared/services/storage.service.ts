import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ApiService} from './api.service';
import {HistoryModel, HistoryValueItemModel} from '../models/HistoryModel';
import {BestScores, DashboardModel, HitRatioChart, RateOfFireChart} from '../models/dashboard-model';


@Injectable({
    providedIn: 'root'
})
export class StorageService {

    DEFAULT_DATA: DashboardModel = new DashboardModel();

    // TEMP_TRAINING_HISTORY: DashboardModel = [
    //     {
    //         date: 'Fri Feb 28 2020 13:02:29 GMT+0200 (Israel Standard Time)',
    //         day: 'Friday',
    //         drillType: 'Bullseye',
    //         hits: 10,
    //         totalShots: 5,
    //         range: 150,
    //         timeLimit: null,
    //         points: 10,
    //         recommendation: {
    //             Probabilty: 0,
    //             Recommendation: 'Tightening Grip While Pulling Trigger'
    //         },
    //         shots: [
    //             {
    //                 x: 244.2,
    //                 y: 259.375
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 259.375
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 259.375
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 208.5
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 106.75
    //             }
    //         ],
    //         email: 'boazy@gmail.com'
    //     },
    //     {
    //         date: 'Fri Feb 28 2020 13:37:37 GMT+0200 (Israel Standard Time)',
    //         day: 'Friday',
    //         drillType: 'Bullseye',
    //         hits: 10,
    //         totalShots: 5,
    //         range: 150,
    //         timeLimit: null,
    //         points: 10,
    //         shots: [
    //             {
    //                 x: 244.2,
    //                 y: 259.375
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 208.5
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 106.75
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 157.625
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 208.5
    //             }
    //         ],
    //         recommendation: {
    //             Probabilty: 0,
    //             Recommendation: 'Tightening Grip While Pulling Trigger'
    //         },
    //         email: 'boazy@gmail.com'
    //     },
    //     {
    //         date: 'Fri Feb 28 2020 13:40:06 GMT+0200 (Israel Standard Time)',
    //         day: 'Friday',
    //         drillType: 'Bullseye',
    //         hits: 10,
    //         totalShots: 5,
    //         range: 150,
    //         timeLimit: null,
    //         points: 10,
    //         shots: [
    //             {
    //                 x: 244.2,
    //                 y: 259.375
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 208.5
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 157.625
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 106.75
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 208.5
    //             }
    //         ],
    //         recommendation: {
    //             Probabilty: 0,
    //             Recommendation: 'Tightening Grip While Pulling Trigger'
    //         },
    //         email: 'boazy@gmail.com'
    //     },
    //     {
    //         date: 'Fri Feb 28 2020 13:40:42 GMT+0200 (Israel Standard Time)',
    //         day: 'Friday',
    //         drillType: 'Bullseye',
    //         hits: 10,
    //         totalShots: 5,
    //         range: 150,
    //         timeLimit: null,
    //         points: 10,
    //         shots: [
    //             {
    //                 x: 244.2,
    //                 y: 259.375
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 208.5
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 157.625
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 106.75
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 157.625
    //             }
    //         ],
    //         recommendation: {
    //             Probabilty: 0,
    //             Recommendation: 'Tightening Grip While Pulling Trigger'
    //         },
    //         email: 'boazy@gmail.com'
    //     },
    //     {
    //         date: 'Fri Feb 28 2020 13:43:02 GMT+0200 (Israel Standard Time)',
    //         day: 'Friday',
    //         drillType: 'Bullseye',
    //         hits: 10,
    //         totalShots: 5,
    //         range: 150,
    //         timeLimit: null,
    //         points: 10,
    //         shots: [
    //             {
    //                 x: 244.2,
    //                 y: 259.375
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 208.5
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 157.625
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 106.75
    //             },
    //             {
    //                 x: 244.2,
    //                 y: 157.625
    //             }
    //         ],
    //         recommendation: {
    //             Probabilty: 0.75,
    //             Recommendation: 'Good Shooting'
    //         },
    //         email: 'boazy@gmail.com'
    //     }
    // ];

    data = {};
    DATA_NAME = 'homeData';
    historicalTrainingsDate$ = new BehaviorSubject<any>(null);
    DEFAULT_WEAPONS = [
        'AR-15',
        'M4',
        'MP5',
        'DOUBLE BARREL SHOTGUN',
        'P40'
    ];
    DEFAULT_SIGHTS = [
        'Trij',
        'SLT',
        'XXX',
        'DP',
        'P40'
    ];

    constructor(private apiService: ApiService) {
        this.initData();
        this.trySyncData();
    }

    trySyncData() {

    }


    initData() {
        let storageData = localStorage.getItem(this.DATA_NAME) as any;
        if (!storageData) {
            localStorage.setItem(this.DATA_NAME, JSON.stringify({}));
            storageData = localStorage.getItem(this.DATA_NAME) as any;
        }
        storageData = JSON.parse(storageData);
        this.setItem('homeData', storageData);
        this.data = storageData;
    }


    getItem(key?: string): any {
        const val = localStorage.getItem(key);
        return JSON.parse(val);
    }


    setItem(key: string, value: any) {
        if (!this.data) {
            this.data = {};
        }
        this.data[key] = value;
        localStorage.setItem(key, JSON.stringify(value));
    }


    passhistoricalTrainingsDate(date: HistoryModel) {
        this.historicalTrainingsDate$.next(date);
    }

    private handleMockData() {
        this.setItem('homeData', this.DEFAULT_DATA);
        this.data = this.DEFAULT_DATA;
    }
}


// storageData.homeData = {
//     hitRatioChart: {data: [[65, 35]]},
//     rateOfFireChart: {
//         chartData: [{data: [65, 59, 80, 81, 56, 55, 40]}],
//         chartLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
//     },
//     trainingHistory: this.TEMP_TRAINING_HISTORY,
//     bestScores: {
//         longestShot: 1250,
//         avgSplit: 2.5,
//         avgDistance: 3,
//         lastShooting: new Date()
//     }
// };
