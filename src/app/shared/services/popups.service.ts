import {Injectable} from '@angular/core';
import {ErrorModalComponent} from '../popups/error-modal/error-modal.component';
 import {NoConnetionErroComponent} from '../popups/no-connection/no-connetion-error';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class PopupsService {

    constructor(public dialog: MatDialog) {
    }

    showNoConnectionPopup() {
        const dialogRef = this.dialog.open(NoConnetionErroComponent, {
            data: {modalType: 'general'}
        });
    }

    showErrorModal() {

    }
}
