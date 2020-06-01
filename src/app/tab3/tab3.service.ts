import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Tab3Service {
    passProfileFromRegister = new BehaviorSubject(null);
    isFromRegister = new BehaviorSubject<any>(null);

    constructor() {
    }

    notifyOnRegister() {
        this.isFromRegister.next(true);
    }
}
