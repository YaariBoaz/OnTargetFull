import {Injectable, NgZone} from '@angular/core';
import {ApiService} from './api.service';
import {StorageService} from './storage.service';
import {UserService} from './user.service';
import {BLE} from '@ionic-native/ble/ngx';
import {BehaviorSubject, Subject} from 'rxjs';
import {GatewayService} from './gateway.service';
import {BleService} from './ble.service';


@Injectable({
    providedIn: 'root'
})
export class InitService {

    notifyConnectedGatewayId = new BehaviorSubject(null);
    notifyError = new BehaviorSubject(null);
    isLoading = new Subject();
    isGateway = false;
    notifySignupFinished = new BehaviorSubject(null);
    newDashboardData = new BehaviorSubject(null);
    private targets = [];
    private currentTargetId;

    constructor(private ngZone: NgZone, private apiService: ApiService, private storageService: StorageService, private userService: UserService, public ble: BLE) {
    }

    distory() {
        const id = localStorage.getItem('currentTargetId');
        this.ble.disconnect(id).then(() => {
            console.log('Called Disconnect');
        });
    }

    getTargets() {
        return this.targets;
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


    isRegistered() {
        return this.storageService.getItem('regisered');
    }


}
