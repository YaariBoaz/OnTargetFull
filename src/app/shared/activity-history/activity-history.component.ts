// @ts-ignore
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NetworkService} from '../services/network.service';
import {StorageService} from '../services/storage.service';
import {Router} from '@angular/router';

// @ts-ignore
@Component({
    selector: 'app-activity-history',
    templateUrl: './activity-history.component.html',
    styleUrls: ['./activity-history.component.scss'],
})
export class ActivityHistoryComponent implements OnInit, OnChanges {
    train = {
        date: '05.07.18',
        day: 'Tuesday',
        numberOfDrills: 6
    };
    drills: TrainingHistory[];
    hasConnection;
    currentDay;
    numOfTrainings;
    beutifiedDate;
    stats = [];
    summaryObject;

    constructor(private  router: Router, private  networkService: NetworkService, private stoargeService: StorageService) {
        this.networkService.hasConnectionSubject$.subscribe(hasConnection => {
            this.hasConnection = hasConnection;
            if (this.hasConnection) {
                this.handleOfflineScenario();
            } else {
                this.handleOfflineScenario();
            }
        });
    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    toggleAccordian(event, index) {
        const element = event.target;
        element.classList.toggle('active');
        if ((this.drills[index] as any).isActive) {
            (this.drills[index] as any).isActive = false;
        } else {
            (this.drills[index] as any).isActive = true;
        }
        const panel = element.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + 'px';
        }
    }

    onBackPressed() {
        this.router.navigateByUrl('/home/tabs/tab1');
    }

    handleOfflineScenario() {
        this.stoargeService.historicalTrainingsDate$.subscribe((date) => {
            if (date) {
                this.beutifiedDate = Object.keys(date.value)[0];
                this.currentDay =  date.value[this.beutifiedDate]['day'];
                const arrayOfTrainings = date.value[this.beutifiedDate]['data'];
                this.numOfTrainings = arrayOfTrainings.length;
                this.drills = arrayOfTrainings;
                this.stats = date.stata;
                this.summaryObject = date.summaryObject;
            }

        });

    }

    handleOnlineScenario() {

    }
}

export interface TrainingHistory {
    date: string;
    day: string;
    numberOfDrills: number;
    hits: number;
    totalShots: number;
    range: number;
    timeLimit: number;
    drillType: string;
    points: number;
    recommendation: string;
}
