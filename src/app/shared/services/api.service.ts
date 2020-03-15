import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    BASE_URL = 'htttp://192.168.0.1:8089/';

    constructor(private http: HttpClient) {
    }

    ping(): Observable<any> {
        return this.http.get(this.BASE_URL + 'ping');
    }

    getDashboardData(): Observable<any> {
        return this.http.get(this.BASE_URL + 'getDashboard');
    }
}
