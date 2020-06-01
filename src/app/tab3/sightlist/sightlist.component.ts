import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {StorageService} from '../../shared/services/storage.service';
import {InventoryModel} from '../../shared/models/InventoryModel';
import {UserService} from '../../shared/services/user.service';
import {ApiService} from '../../shared/services/api.service';

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
    inventory: InventoryModel;

    constructor(private storageService: StorageService, private userService: UserService, private apiService: ApiService) {
    }

    ngOnInit() {
        this.inventory = this.storageService.getItem('inventory');
        this.DEFAULT_SIGHTS = this.storageService.getItem('sightList');
        this.mySights = this.inventory.sight;
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

        const inventory: InventoryModel = {
            wepons: this.inventory.wepons,
            sight: this.mySights,
            userId: this.userService.getUserId()
        };
        this.storageService.setItem('inventory', inventory);

        this.apiService.setInventory(inventory).subscribe(data => {
            this.storageService.setItem('inventory', data);
            this.close.emit();
        });

        this.storageService.setItem('sightList', this.mySights);
        this.close.emit();
    }

    onRemoveFromList(item: any) {
        this.mySights.splice(this.mySights.indexOf(item), 1);
    }
}
