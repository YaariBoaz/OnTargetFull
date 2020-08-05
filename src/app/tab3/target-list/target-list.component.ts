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
    isScanning = false;
    devices = [];
    @Output()
    close = new EventEmitter();

    constructor(private ble: BleService, private storageService: StorageService, private router: Router) {
    }

    ngOnInit() {
        this.ble.scan();
        this.isScanning = true;
        setTimeout(() => {
            this.isScanning = false;
            this.devices = this.ble.getDevices();
        }, 6000);

    }

    connectBle(device: any) {
        this.storageService.setItem('target', device);
        this.close.emit();

    }

    closeDialog() {
        this.close.emit();
    }
}
