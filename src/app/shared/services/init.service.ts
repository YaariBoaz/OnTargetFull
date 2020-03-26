import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {StorageService} from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class InitService {

    constructor(private apiService: ApiService, private storageService: StorageService) {
        this.trySyncData();
    }

    trySyncData() {
        this.apiService.syncData(this.storageService.TEMP_TRAINING_HISTORY).subscribe(data => {
            debugger;
        });
    }
}
