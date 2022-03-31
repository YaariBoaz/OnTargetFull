import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {InventoryModel} from '../../models/InventoryModel';
import {ApiService} from '../../services/api.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {StorageService} from '../../services/storage.service';
import {Tab3Service} from '../../../tab3/tab3.service';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {InitService} from '../../services/init.service';
import {HttpClient} from '@angular/common/http';

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
    afterSubscriptionDone = new BehaviorSubject({});
    isFromListScreen = false;
    moreInfoForm = {} as any;
    isLoading = new Subject();
    BACKOFFICE_URL = 'https://adlbackoffice20200309103113.azurewebsites.net/';

    constructor(private apiService: ApiService,
                private storageService: StorageService,
                private tab3Service: Tab3Service,
                private http: HttpClient,
                private initService: InitService,
                private userService: UserService,
                private router: Router) {
    }


    registerUser(registerUser) {
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
        toSend.state = this.registerForm.value.cityName;
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
        // this.initService.isLoading.next(true);
        this.isLoading.next(true);
        this.http.post(this.BACKOFFICE_URL + 'Login/register', toSend).subscribe((returnedValue) => {
            console.log('In registerUser AFTER HTTP For Register BEFORE SignIn' + new Date());
            this.login({
                username: toSend.email,
                password: toSend.password
            }).subscribe((data) => {
                if (data) {
                    this.userService.setUser(data);
                    this.getDashboardData(this.userService.getUserId());
                    this.storageService.setItem('isLoggedIn', true);
                    this.storageService.setItem('profileData', data);
                    this.notifyUserWasRegisterd.next(true);
                    this.isLoading.next(false);
                }
            });
        });

    }

    login(loginDetails) {
        return this.http.post(this.BACKOFFICE_URL + 'Login/authenticate', loginDetails);
    }

    getDashboardData(userId): Observable<any> {
        return this.http.get(this.BACKOFFICE_URL + 'DeviceData/GetDashboard?userId=' + userId);
    }


}
