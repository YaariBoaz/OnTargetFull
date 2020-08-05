import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {StorageService} from '../../shared/services/storage.service';
import {ApiService} from '../../shared/services/api.service';
import {InventoryModel} from '../../shared/models/InventoryModel';
import {UserService} from '../../shared/services/user.service';

@Component({
    selector: 'app-gunlist',
    templateUrl: './gunlist.component.html',
    styleUrls: ['./gunlist.component.scss'],
})
export class GunlistComponent implements OnInit {
    @Output()
    close = new EventEmitter();
    public goalList: any[];
    public DEFUALT_GUNS: {};
    models = null;
    myGuns = null;
    private selectedGunType = '';

    constructor(private storageService: StorageService,
                public alertController: AlertController,
                private apiService: ApiService,
                private userService: UserService) {
    }

    ngOnInit() {
        const inventory = this.storageService.getItem('inventory');
        if (!inventory) {
            this.myGuns = [];
        } else {
            this.myGuns = inventory.wepons;
        }
        this.DEFUALT_GUNS = this.storageService.getItem('gunList');
    }

    filterList($event) {
        const searchTerm = $event.srcElement.value;
        if (!searchTerm) {
            return;
        }

        this.goalList = this.goalList.filter(currentGoal => {
            if (currentGoal && searchTerm) {
                if (currentGoal.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                    return true;
                }
                return false;
            }
        });
    }


    onBackPressed() {

    }

    onShowModel(item) {
        this.selectedGunType = item.key;
        this.models = this.DEFUALT_GUNS[item.key];
    }

    async gunWasSelected(item) {
        const alert = await this.alertController.create({
            header: 'Duplicate Error',
            message: item.model + ' is already selected',
            buttons: ['OK']
        });
        await alert.present();
    }

    onSingleClick(item) {
        if (!this.myGuns) {
            this.myGuns = [];
        }
        if (this.myGuns.filter(o => o === item).length === 0) {
            this.myGuns.push(item);
        } else {
            this.gunWasSelected(item);
        }
    }

    onModelClicked(item: any) {
        if (!this.myGuns) {
            this.myGuns = [];
        }
        if (this.myGuns.filter(o => o === item.model).length === 0) {
            this.myGuns.push(item.model);
        } else {
            this.gunWasSelected(item);
        }
        this.DEFUALT_GUNS [this.selectedGunType].forEach(model => {
            if (model.model === item.model) {
                model.isSelected = !model.isSelected;
            }
        });
        this.models = null;
    }

    onSaveWeapons() {
        const mySights = this.storageService.getItem('mysightList');
        const inventory: InventoryModel = {
            wepons: this.myGuns,
            sight: mySights,
            userId: this.userService.getUserId()
        };
        this.storageService.setItem('inventory', inventory);
        this.close.emit();
    }

    removeMyGun(item: any) {
        this.myGuns.splice(this.myGuns.indexOf(item), 1);
    }
}
