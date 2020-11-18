import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TabsService {

    $notifyTab1 = new BehaviorSubject<any>(false);
    $notifyTab2 = new BehaviorSubject<any>(false);
    $notifyTab3 = new BehaviorSubject<any>(false);


    constructor() {
    }

    notifyTab1() {
        this.$notifyTab1.next(true);
    }

    notifyTab2() {
        this.$notifyTab2.next(true);
    }

    notifyTab3() {
        this.$notifyTab3.next(true);
    }
}
