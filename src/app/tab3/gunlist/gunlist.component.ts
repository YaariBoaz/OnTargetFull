import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {StorageService} from '../../shared/services/storage.service';

@Component({
    selector: 'app-gunlist',
    templateUrl: './gunlist.component.html',
    styleUrls: ['./gunlist.component.scss'],
})
export class GunlistComponent implements OnInit {
    @Output()
    close = new EventEmitter();
    DEFUALT_GUNS = {
        AR: [{model: 'M5', isSelected: false}, {model: 'M16', isSelected: false}],
        Colt: [{model: 'COLT 1', isSelected: false}, {model: 'COLT 2', isSelected: false}],
        Remington: [{model: 'Remington 1', isSelected: false}, {model: 'Remington 2', isSelected: false}],
    };
    public goalList: any[];
    public loadedGoalList: {};
    models = null;
    myGuns = null;
    private selectedGunType = '';

    constructor(private storageService: StorageService  , public alertController: AlertController) {
    }

    ngOnInit() {
        this.myGuns = this.storageService.getItem('gunList');
        this.loadedGoalList = this.DEFUALT_GUNS;
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

    onModelClicked(item: any) {
        if (!this.myGuns) {
            this.myGuns = [];
        }
        if (this.myGuns.filter(o => o === item.model).length === 0) {
            this.myGuns.push(item.model);
        } else {
            this.gunWasSelected(item);
        }
        this.DEFUALT_GUNS[this.selectedGunType].forEach(model => {
            if (model.model === item.model) {
                model.isSelected = !model.isSelected;
            }
        });
        this.models = null;
    }

    onSaveWeapons() {
        this.storageService.setItem('gunList', this.myGuns);
        this.close.emit();
    }

    removeMyGun(item: any) {
        this.myGuns.splice(this.myGuns.indexOf(item), 1);
    }
}
