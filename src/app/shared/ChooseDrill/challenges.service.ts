import {Injectable} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Observable} from 'rxjs';
import {UserService} from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class ChallengesService {

    constructor(private api: ApiService, private userService: UserService) {
    }

    getChallenges(): Observable<any> {
        return this.api.getChallenges();
    }

    getMyChallenges(): Observable<any> {
        return this.api.getMyChallenges(this.userService.getUserId());
    }
}
