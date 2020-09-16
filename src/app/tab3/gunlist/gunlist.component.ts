import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {StorageService} from '../../shared/services/storage.service';
import {ApiService} from '../../shared/services/api.service';
import {InventoryModel} from '../../shared/models/InventoryModel';
import {UserService} from '../../shared/services/user.service';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-gunlist',
    templateUrl: './gunlist.component.html',
    styleUrls: ['./gunlist.component.scss'],
})
export class GunlistComponent implements OnInit {
    @Output()
    close = new EventEmitter();
    public goalList: any[];
    public DEFUALT_GUNS: [];
    models = null;
    myGuns = null;
    private selectedGunType = '';


    constructor(private storageService: StorageService,
                public alertController: AlertController,
                private apiService: ApiService,
                private changeDetection: ChangeDetectorRef,
                private router: Router,
                public dialogRef: MatDialogRef<GunlistComponent>,
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


    onBackPressed() {
        this.dialogRef.close();
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
        if (this.myGuns.filter(o => o === item).length === 0) {
            this.myGuns.push(item);
            let inventory = this.storageService.getItem('inventory');
            if (!inventory) {
                inventory = {};
            }
            inventory.wepons = this.myGuns;
            this.storageService.setItem('inventory', inventory);
        } else {
            this.myGuns.splice(this.myGuns.indexOf(item), 1);
        }
        this.changeDetection.detectChanges();
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

    isWeaponSelected(weapon) {
        return this.myGuns.includes(weapon);
    }
}
