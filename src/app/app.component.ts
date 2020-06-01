import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {BLE} from '@ionic-native/ble/ngx';
import {Platform} from '@ionic/angular';
import {InitService} from './shared/services/init.service';
import {Observable, of} from 'rxjs';
import {BleService} from './shared/services/ble.service';
import {transition, trigger, useAnimation} from '@angular/animations';
import {bounceInDown, bounceInLeft, bounceInRight, bounceInUp, zoomIn} from 'ngx-animate/lib';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    animations: [
        trigger('zoomIn', [transition('* => *', useAnimation(zoomIn, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {timing: 5}
        }))]),
        trigger('bounceInRight', [transition('* => *', useAnimation(bounceInRight, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {deley: 2, timing: 2}
        }))]),
        trigger('bounceInLeft', [transition('* => *', useAnimation(bounceInLeft, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {deley: 3, timing: 4}
        }))]),
        trigger('bounceInUp', [transition('* => *', useAnimation(bounceInUp, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {deley: 4, timing: 6}
        }))]),
        trigger('bounceInDown', [transition('* => *', useAnimation(bounceInDown, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {deley: 5, timing: 8}
        }))])
    ],
})
export class AppComponent implements OnDestroy, OnInit {
    private devices;
    splash = true;

    constructor(
        private platform: Platform,
        private initService: InitService,
        public ble: BleService,
    ) {
        this.initService.getDashboard();
        this.initService.getSights();
        this.initService.getWeapons();
        this.platform.ready().then(() => {
            this.ble.scan();

        });
    }

    ngOnInit() {
        setTimeout(() => {
            this.splash = false;
        }, 5000);
    }


    ngOnDestroy(): void {
        console.log('App Destoryed');
    }
}
