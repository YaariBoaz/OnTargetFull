import {ErrorHandler, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GlobalErrorHandler  implements ErrorHandler {

    constructor() {
    }

    handleError(error: any): void {
        console.log('My Errros: ' + error);
    }
}
