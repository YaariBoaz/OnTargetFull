import {Component, OnInit} from '@angular/core';
import {HistoryModel} from '../models/HistoryModel';
import {StorageService} from '../services/storage.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ActivityHistoryComponent} from '../activity-history/activity-history.component';

@Component({
    selector: 'app-activity-log',
    templateUrl: './activity-log.component.html',
    styleUrls: ['./activity-log.component.scss'],
})
export class ActivityLogComponent implements OnInit {
    trains;
    cal;
    months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];


    constructor(private storageService: StorageService, public dialog: MatDialog, public dialogRef: MatDialogRef<ActivityLogComponent>) {
    }

    ngOnInit() {
        this.storageService.historicalTrainingsDate$.subscribe((data: HistoryModel) => {
            if (data) {
                this.trains = data;
                this.trains = this.trains.sort((a, b) => new Date(b.sessionDateTime).getTime() - new Date(a.sessionDateTime).getTime());
                this.cal = {};
                this.trains.forEach(train => {
                    const month = new Date(train.drillDate).toLocaleString('en-US', {month: 'long'});
                    if (!(month in this.cal)) {
                        this.cal[month] = {};
                    }

                    if (!(new Date(train.drillDate).toLocaleDateString('en-US') in this.cal[month])) {
                        this.cal[month][new Date(train.drillDate).toLocaleDateString('en-US')] = [];
                    }
                    this.cal[month][new Date(train.drillDate).toLocaleDateString('en-US')].push(train);
                });
                const arr = [];
                Object.keys(this.cal).forEach(key => {
                    arr.push({name: key, value: this.cal[key]});
                });

                arr.sort((a, b) => {
                    return this.months.indexOf(a.name) - this.months.indexOf(b.name);
                });
                this.cal = arr;
            }
        });
    }

    insert(array, index, item) {
        array.splice(index, 0, item);
    };

    onBackPressed() {
        this.dialogRef.close();
    }

    onDateClicked(trainInDate) {
        this.storageService.passhistoricalTrainingsDate(trainInDate);
        this.dialog.open(ActivityHistoryComponent, {
            panelClass: 'full-screen-modal',
            data: {modalType: 'general'}
        });
    }
}
