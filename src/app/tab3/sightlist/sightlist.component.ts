import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {StorageService} from '../../shared/services/storage.service';
import {InventoryModel} from '../../shared/models/InventoryModel';
import {UserService} from '../../shared/services/user.service';
import {ApiService} from '../../shared/services/api.service';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {MatDialogRef} from '@angular/material/dialog';

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

    constructor(
        private storageService: StorageService,
        private userService: UserService,
        private apiService: ApiService,
        private router: Router,
        public dialogRef: MatDialogRef<SightlistComponent>,
        private changeDetection: ChangeDetectorRef,
        public alertController: AlertController) {
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

    initializeItems(): void {
        this.sightList = this.loadedSightList;
    }

    onBackPressed() {
        this.dialogRef.close();
    }

    async sightWasSelected(item) {
        const alert = await this.alertController.create({
            header: 'Duplicate Error',
            message: item.model + ' is already selected',
            buttons: ['OK']
        });
        await alert.present();
        }


    onAddSight(item) {
        if (!this.mySights) {
            this.mySights = [];
        }
        if (this.mySights.filter(o => o === item).length === 0) {
            this.mySights.push(item);
            let inventory = this.storageService.getItem('inventory');
            if (!inventory) {
                inventory = {};
            }
            inventory.sight = this.mySights;
            this.storageService.setItem('inventory', inventory);
        } else {
            this.mySights.splice(this.mySights.indexOf(item), 1);
        }
        this.changeDetection.detectChanges();
    }


    onRemoveFromList(item: any) {
        this.mySights.splice(this.mySights.indexOf(item), 1);
    }

    isSightSelected(sight: string) {
        return this.mySights.includes(sight);
    }
}
