import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InventoryModel} from '../models/InventoryModel';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    BASE_URL = 'htttp://192.168.0.1:8089/';
    BACKOFFICE_URL = 'https://adlbackoffice20200309103113.azurewebsites.net/';

    constructor(private http: HttpClient) {
    }

    ping(): Observable<any> {
        return this.http.get(this.BASE_URL + 'ping');
    }

    getDashboardData(userId): Observable<any> {
        return this.http.get(this.BACKOFFICE_URL + 'DeviceData/GetDashboard?userId=' + userId);
    }

    signup(registerDetails) {
        return this.http.post(this.BACKOFFICE_URL + 'Login/register', registerDetails);
    }

    login(loginDetails) {
        return this.http.post(this.BACKOFFICE_URL + 'Login/authenticate', loginDetails);
    }

    syncData(dataToSync) {
        return this.http.post(this.BACKOFFICE_URL + 'DeviceData/uploadDrills', dataToSync);
    }

    getWeapons() {
        return this.http.get(this.BACKOFFICE_URL + '/DeviceData/getWeapons');
    }

    getSights() {
        return this.http.get(this.BACKOFFICE_URL + '/DeviceData/getSights');
    }

    getInventory() {
        return this.http.get(this.BACKOFFICE_URL + '/DeviceData/getInventory');
    }

    setInventory(inventoryModel: InventoryModel) {
        return this.http.post(this.BACKOFFICE_URL + '/DeviceData/setInventory', inventoryModel);
    }


}


