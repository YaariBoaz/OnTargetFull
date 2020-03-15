import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from '../shared/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class Tab1ServiceService {


    constructor(private apiService: ApiService) {
    }


}
