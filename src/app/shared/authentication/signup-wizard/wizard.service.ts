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
    isFromListScreen = false;
    moreInfoForm: any;

    constructor(private apiService: ApiService,
                private storageService: StorageService,
                private tab3Service: Tab3Service,
                private userService: UserService) {


    }


    registerUser() {
        let myTarget = this.storageService.getItem('personalTarget');
        myTarget = {
            id: myTarget.id,
            name: myTarget.name
        };
        const toSend = {} as any;
        toSend.userInfo = this.registerForm.value;
        toSend.sights = this.moreInfoForm.sights;
        toSend.weapons = this.moreInfoForm.weapons;
        toSend.target = this.moreInfoForm.target;
        toSend.target = myTarget;
        this.notifyWizardSummaryStart.next(true);
        debugger
        this.apiService.signup(toSend).subscribe((returnedValue) => {
            ;
        });

    }


}
