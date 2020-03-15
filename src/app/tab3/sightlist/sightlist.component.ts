import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {StorageService} from '../../shared/services/storage.service';

@Component({
    selector: 'app-sightlist',
    templateUrl: './sightlist.component.html',
    styleUrls: ['./sightlist.component.scss'],
})
export class SightlistComponent implements OnInit {
    @Output()
    close = new EventEmitter();
    DEFAULT_SIGHTS = [
        'Z1',
        'Z2',
        'Z3',
        'Z4',
        'Z5',
        'Z6',
    ];

    sightList: any[];
    loadedSightList: any[];
    mySights = null;

    constructor(private storageService: StorageService) {
    }

    ngOnInit() {
        this.mySights = this.storageService.getItem('sightList');
        if (!this.mySights) {
            this.mySights = [];
        }
        this.loadedSightList = this.DEFAULT_SIGHTS;
    }

    filterList($event) {
        this.initializeItems();

        const searchTerm = $event.srcElement.value;

        if (!searchTerm) {
            return;
        }

        this.sightList = this.sightList.filter(currentGoal => {
            if (currentGoal && searchTerm) {
                if (currentGoal.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                    return true;
                }
                return false;
            }
        });
    }

    initializeItems(): void {
        this.sightList = this.loadedSightList;
    }

    onBackPressed() {

    }

    onAddSight(item) {
        this.mySights.push(item);
    }

    onSaveMySights() {
        this.storageService.setItem('sightList', this.mySights);
        this.close.emit();
    }

    onRemoveFromList(item: any) {
        this.mySights.splice(this.mySights.indexOf(item), 1);
    }
}
