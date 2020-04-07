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
        debugger;
        this.apiService.syncData(this.storageService.data).subscribe(data => {
            debugger;
        });
    }
}
