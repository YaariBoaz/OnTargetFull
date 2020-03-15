import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    hasConnection = true;
    hasConnectionSubject$ = new BehaviorSubject(this.hasConnection);

    constructor(private apiService: ApiService) {

    }

    hasInternet(): boolean {
        if (!this.hasConnection) {
            return false;
        } else {
            this.apiService.ping().subscribe(
                data => {
                    this.hasConnection = true;
                    this.notifyConnectionChanged();
                },
                error => {
                    this.hasConnection = false;
                    this.notifyConnectionChanged();
                }
            );
        }
    }

    notifyConnectionChanged() {
        this.hasConnectionSubject$.next(this.hasConnection);

    }
}
