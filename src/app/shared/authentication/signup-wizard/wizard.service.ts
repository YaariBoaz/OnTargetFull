import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {InventoryModel} from '../../models/InventoryModel';
import {ApiService} from '../../services/api.service';
import {BehaviorSubject} from 'rxjs';
import {StorageService} from '../../services/storage.service';
import {Tab3Service} from '../../../tab3/tab3.service';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';

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
    selectTargetFromWizardOpened = new BehaviorSubject(false);
    isFromListScreen = false;
    moreInfoForm: any;

    constructor(private apiService: ApiService,
                private storageService: StorageService,
                private tab3Service: Tab3Service,
                private userService: UserService,
                private router: Router) {
    }


    registerUser() {
        let myTarget = this.storageService.getItem('personalTarget');
        myTarget = {
            id: myTarget.id,
            name: myTarget.name
        };
        const toSend = {} as any;
        toSend.age = this.moreInfoForm.age.toString();
        toSend.email = this.registerForm.value.email;
        toSend.first_name = this.registerForm.value.first_name;
        toSend.last_name = this.registerForm.value.last_name;
        toSend.password = this.registerForm.value.password;
        toSend.gender = this.moreInfoForm.gendre;
        toSend.state = this.moreInfoForm.state;
        toSend.conutry = this.moreInfoForm.conutry;
        toSend.img_path = this.moreInfoForm.profilePicture;
        toSend.sights = this.moreInfoForm.sights;
        toSend.weapons = this.moreInfoForm.weapons;
        toSend.target = this.moreInfoForm.target;
        toSend.target = myTarget;
        this.notifyWizardSummaryStart.next(true);
        this.apiService.signup(toSend).subscribe((returnedValue) => {
            this.apiService.login({
                username: toSend.email,
                password: toSend.password
            }).subscribe((data) => {
                if (data) {
                    this.userService.setUser(data);
                    this.apiService.getDashboardData(this.userService.getUserId());
                    this.apiService.getDashboardData(this.userService.getUserId());
                    this.storageService.setItem('isLoggedIn', true);
                    this.storageService.setItem('profileData', data);
                    this.router.navigateByUrl('/home/tabs/tab1');
                }
            });
        });

    }


}
