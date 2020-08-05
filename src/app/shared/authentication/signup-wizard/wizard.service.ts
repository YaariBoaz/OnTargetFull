import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {InventoryModel} from '../../models/InventoryModel';
import {ApiService} from '../../services/api.service';
import {BehaviorSubject} from 'rxjs';
import {StorageService} from '../../services/storage.service';
import {Tab3Service} from '../../../tab3/tab3.service';
import {UserService} from '../../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class WizardService {
    registerForm: FormGroup;
    notifyUserWasRegisterd = new BehaviorSubject(false);
    notifyInventoryWasSet = new BehaviorSubject(false);
    notifyTargetAssigned = new BehaviorSubject(false);
    notifyWizardSummaryStart = new BehaviorSubject(false);
    notifyWeaponWasSet = new BehaviorSubject(false);
    notifyScopeWasSet = new BehaviorSubject(false);

    constructor(private apiService: ApiService,
                private storageService: StorageService,
                private tab3Service: Tab3Service,
                private userService: UserService) {


    }

    registerUser() {
        this.notifyWizardSummaryStart.next(true);

        this.apiService.signup(this.registerForm.value).subscribe((returnedValue) => {
            this.apiService.login({
                username: this.registerForm.value.email,
                password: this.registerForm.value.password
            }).subscribe((data) => {
                this.storageService.setItem('profileData', data);
                this.tab3Service.passProfileFromRegister.next(data);
                this.notifyUserWasRegisterd.next(true);
                setTimeout(() => {
                    const inventory: InventoryModel = this.storageService.getItem('inventory');
                    inventory.userId = this.userService.getUserId();
                    this.apiService.setInventory(inventory).subscribe(inventoryData => {
                        if (inventoryData) {
                            this.notifyWeaponWasSet.next(true);
                            setTimeout(() => {
                                this.notifyScopeWasSet.next(true);
                            }, 1000);

                            setTimeout(() => {
                                this.notifyTargetAssigned.next(true);
                            }, 3000);
                        }
                    });
                }, 2000);

            });
        });
    }


}
