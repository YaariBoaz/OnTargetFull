import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {InventoryModel} from '../../models/InventoryModel';
import {ApiService} from '../../services/api.service';
import {BehaviorSubject} from 'rxjs';
import {StorageService} from '../../services/storage.service';
import {Tab3Service} from '../../../tab3/tab3.service';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {InitService} from '../../services/init.service';

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
                private initService: InitService,
                private userService: UserService,
                private router: Router) {
    }


    registerUser() {
        let myTarget = this.storageService.getItem('personalTarget');
        if (myTarget) {
            myTarget = {
                id: myTarget.id,
                name: myTarget.name
            };
        } else {
            myTarget = {
                id: '',
                name: ''
            };
        }
        const toSend = {
            age: '0',
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            gender: '',
            state: '',
            conutry: '',
            img_path: '',
            sights: [],
            weapons: [],
            target: {
                id: 'string',
                name: 'string'
            }
        };
        if (this.moreInfoForm.age) {
            toSend.age = this.moreInfoForm.age.toString();
        }
        toSend.email = this.registerForm.value.email;
        toSend.first_name = this.registerForm.value.first_name;
        toSend.last_name = this.registerForm.value.last_name;
        toSend.password = this.registerForm.value.password;
        if (this.moreInfoForm.gendre) {
            toSend.gender = this.moreInfoForm.gendre;
        }
        if (this.moreInfoForm.state) {
            toSend.state = this.moreInfoForm.state;
        }
        if (this.moreInfoForm.conutry) {
            toSend.conutry = this.moreInfoForm.conutry;
        }
        if (this.moreInfoForm.profilePicture) {
            toSend.img_path = this.moreInfoForm.profilePicture;
        }
        if (this.moreInfoForm.sights) {
            toSend.sights = this.moreInfoForm.sights;
        }
        if (this.moreInfoForm.weapons) {
            toSend.weapons = this.moreInfoForm.weapons;
        }
        if (this.moreInfoForm.target) {
            toSend.target = this.moreInfoForm.target;
        }
        toSend.target = myTarget;

        console.log('In registerUser Before HTTP For Register' + new Date());
        this.initService.isLoading.next(true);
        this.apiService.signup(toSend).subscribe((returnedValue) => {
            console.log('In registerUser AFTER HTTP For Register BEFORE SignIn' + new Date());
            this.apiService.login({
                username: toSend.email,
                password: toSend.password
            }).subscribe((data) => {
                if (data) {
                    console.log('In registerUser AFTER SignIn' + new Date());
                    this.userService.setUser(data);
                    this.apiService.getDashboardData(this.userService.getUserId());
                    this.apiService.getDashboardData(this.userService.getUserId());
                    this.storageService.setItem('isLoggedIn', true);
                    this.storageService.setItem('profileData', data);
                    console.log('In registerUser BEFORE rout to dashboard' + new Date());
                    this.router.navigateByUrl('/home/tabs/tab1');
                }
            });
        });

    }


}
