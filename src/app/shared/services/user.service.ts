import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private user: any;

    constructor(private storageService: StorageService) {
        this.storageService.getItem('profileData');
     }

    setUser(user: any) {
        this.user = user;
    }

    getUser() {
        if (!this.user) {
            this.user = this.storageService.getItem('profileData');
        }
        return this.user;
    }
}

