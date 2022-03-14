import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private user: any;

    constructor(private storageService: StorageService) {
        this.user = this.storageService.getItem('profileData');
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

    getUserId() {
        if (!this.user) {
            return null;
        }
        return this.user.id;
    }
}

