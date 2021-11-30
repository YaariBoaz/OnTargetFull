import {Injectable, NgZone} from '@angular/core';
import {ApiService, ZeroTableGetObject} from './api.service';
import {StorageService} from './storage.service';
import {UserService} from './user.service';
import {BLE} from '@ionic-native/ble/ngx';
import {BehaviorSubject, Subject} from 'rxjs';
import {GatewayService} from './gateway.service';
import {ShootingService} from './shooting.service';


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
    screenW;
    screenH;

    constructor(private ngZone: NgZone,
                private apiService: ApiService,
                private storageService: StorageService,
                private shootingService: ShootingService,
                public ble: BLE) {
        this.setDeviceSize();
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

    setDeviceSize() {
        this.screenW = screen.width;
        this.screenH = screen.height;
    }

    getWeapons() {
        this.apiService.getWeapons().subscribe(weapons => {
            this.storageService.setItem('gunList', weapons);
            this.shootingService.weapons = weapons;
        });
    }

    getSights() {
        this.apiService.getSights().subscribe(sights => {
            this.storageService.setItem('sightList', sights);
        });
    }

    getSightsZeroing() {
        this.apiService.getSightsZeroing().subscribe(sights => {
            this.shootingService.sightsZeroing = sights;
        });
    }

    getCalibers() {
        this.apiService.getCalibers().subscribe(calibers => {
            this.storageService.setItem('caliberList', calibers);
            this.shootingService.calibers = calibers;
        });
    }


    isRegistered() {
        return this.storageService.getItem('regisered');
    }


}
