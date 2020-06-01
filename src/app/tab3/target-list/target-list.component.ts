import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BleService} from '../../shared/services/ble.service';
import {StorageService} from '../../shared/services/storage.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-target-list',
    templateUrl: './target-list.component.html',
    styleUrls: ['./target-list.component.scss'],
})
export class TargetListComponent implements OnInit {
    private isScanning = false;
    private devices = [];

    constructor(private ble: BleService, private storageService: StorageService, private router: Router) {
    }

    ngOnInit() {
        this.ble.scan();
        this.isScanning = true;
        setTimeout(() => {
            this.isScanning = false;
            this.devices = this.ble.getDevices().filter(o => o.name && o.name.toLowerCase().indexOf('adl') > -1);
        }, 6000);

    }

    connectBle(device: any) {
        this.storageService.setItem('target', device);
        this.storageService.setItem('regisered', true);
        this.router.navigateByUrl('/home/tabs/tab1');
    }
}
