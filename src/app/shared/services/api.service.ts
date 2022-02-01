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

    // BASE_URL = 'http://192.168.0.104/';
    // BASE_URL = 'htttp:/127.0.0.1:5001/';
    // BACKOFFICE_URL = 'http://192.168.0.104:9080/';

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

    syncDataHitNoHit(dataToSync) {
        return this.http.post(this.BACKOFFICE_URL + 'DeviceData/uploadHitNotHitDrills', dataToSync);
    }

    getChallenges(): Observable<any> {
        return this.http.get(this.BACKOFFICE_URL + 'Challenge/getChallenges');
    }

    getMyChallenges(userId): Observable<any> {
        return this.http.get(this.BACKOFFICE_URL + 'Challenge/getMyChallenges?userId=' + userId);
    }

    syncDataGateway(dataToSync) {
        return this.http.post(this.BACKOFFICE_URL + 'DeviceData/uploadDrillsMobile', dataToSync);
    }

    getWeapons() {
        return this.http.get(this.BACKOFFICE_URL + 'Zeroing/getWeapons');
    }

    getSights() {
        return this.http.get(this.BACKOFFICE_URL + 'DeviceData/getSights');
    }


    getCalibers() {
        return this.http.get(this.BACKOFFICE_URL + 'Zeroing/GetCaliberMapping');
    }

    getInventory() {
        return this.http.get(this.BACKOFFICE_URL + 'DeviceData/getInventory');
    }

    setInventory(inventoryModel: InventoryModel) {
        return this.http.post(this.BACKOFFICE_URL + 'DeviceData/setInventory', inventoryModel);
    }


    //Zeriong


    getZeroTable(data: ZeroTableGetObject) {
        return this.http.post(this.BACKOFFICE_URL + 'Zeroing/GetZeroTable', data);
    }

    getCaliberMapping() {
        return this.http.get(this.BACKOFFICE_URL + 'Zeroing/GetCaliberMapping');
    }

    getCalibersTable() {
        return this.http.get(this.BACKOFFICE_URL + 'Zeroing/GetCalibersTable');
    }

    getWepons() {
        return this.http.get(this.BACKOFFICE_URL + 'Zeroing/GetWepons');
    }

    getSightsZeroing() {
        return this.http.get(this.BACKOFFICE_URL + 'Zeroing/GetSights');
    }

    getBullets() {
        return this.http.get(this.BACKOFFICE_URL + 'Zeroing/GetBullets');
    }

    getBallisticData(weaponName, sightName) {
        return this.http.get(this.BACKOFFICE_URL + 'Zeroing/getBallisticData?weponName=' + weaponName + '&sightName=' + sightName);
    }

}


export interface ZeroTableGetObject {
    ballisticCoefficient: number;
    initialVelocity: number;
    zeroRange: number;
    boreAngle: number;
    sightHeight: number;
    altitude: number;
    barometer: number;
    temperature: number;
    relativeHumidity: number;
    windSpeed: number;
    yIntercept: number;
    windangle: number;
    isMetric: boolean;
}
