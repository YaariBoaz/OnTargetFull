import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {StorageService} from './storage.service';
import {UserService} from './user.service';
import {BLE} from '@ionic-native/ble/ngx';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InitService {
    notifyError = new BehaviorSubject(null);
    isLoading = new BehaviorSubject(false);
    constructor(private apiService: ApiService, private storageService: StorageService, private userService: UserService, public ble: BLE) {

    }

    notifyOnErrorFunc(error) {
        this.notifyError.next(error);
    }

    getWeapons() {
        this.apiService.getWeapons().subscribe(weapons => {
            this.storageService.setItem('gunList', weapons);
        });
    }

    getSights() {
        this.apiService.getSights().subscribe(sights => {
            this.storageService.setItem('sightList', sights);
        });
    }

    getDashboard() {
        const userId = this.userService.getUserId();
        if (userId) {
            this.apiService.getDashboardData(userId).subscribe(data => {
                this.storageService.setItem('homeData', data);
            });
        }
    }

    startBLEScan() {
        console.log('In start Scanning');
        this.ble.startScan([]).subscribe(data => {
            const lom = String.fromCharCode.apply(null, new Uint8Array(data.advertisement));
        });
    }

    isRegistered() {
        return this.storageService.getItem('regisered');
    }
}
