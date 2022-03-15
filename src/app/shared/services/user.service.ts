import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import {ApiService} from './api.service';
import {InitService} from './init.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private user: any;

    constructor(private storageService: StorageService,private apiService:ApiService,private initService:InitService) {
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

