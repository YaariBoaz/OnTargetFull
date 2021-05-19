// @ts-ignore
import {Component, ElementRef, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NetworkService} from '../services/network.service';
import {StorageService} from '../services/storage.service';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';
import {HistoryModel, HistoryValueItemModel} from '../models/HistoryModel';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ImodalType} from '../popups/error-modal/error-modal.component';

// @ts-ignore
@Component({
    selector: 'app-activity-history',
    templateUrl: './activity-history.component.html',
    styleUrls: ['./activity-history.component.scss'],
})
export class ActivityHistoryComponent implements OnInit, OnChanges {
    @ViewChild('container') container: ElementRef;

    train = {
        date: '05.07.18',
        day: 'Tuesday',
        numberOfDrills: 6
    };
    openShowMore = false;
    drills: HistoryValueItemModel[];
    hasConnection;
    currentDay;
    numOfTrainings;
    beutifiedDate;
    stats = [];
    summaryObject;
    trains;

    constructor(private router: Router,
                private networkService: NetworkService,
                public dialogRef: MatDialogRef<ActivityHistoryComponent>,
                private stoargeService: StorageService,
                private platform: Platform) {
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
        this.dialogRef.close();
    }

    handleOfflineScenario() {
        this.stoargeService.historicalTrainingsDate$.subscribe((data: HistoryModel) => {
            if (data) {
                this.trains = data;
            }

        });
    }

    miliToTime(duration) {
        // tslint:disable-next-line:radix
        const milliseconds: any = parseInt(String((duration % 1000) / 100));
        let seconds: any = Math.floor((duration / 1000) % 60);
        let minutes: any = Math.floor((duration / (1000 * 60)) % 60);
        let hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        return minutes + ':' + seconds + '.' + milliseconds;
    }

    handleOnlineScenario() {

    }

    toggleMenu(menu: HTMLElement) {
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
        } else {
            menu.classList.add('active');
        }
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
