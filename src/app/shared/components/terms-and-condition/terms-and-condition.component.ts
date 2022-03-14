import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-terms-and-condition',
    templateUrl: './terms-and-condition.component.html',
    styleUrls: ['./terms-and-condition.component.scss'],
})
export class TermsAndConditionComponent implements OnInit {

    constructor(private dialogRef: MatDialogRef<TermsAndConditionComponent>) {
    }

    ngOnInit() {
    }

    onCloseDialog(num) {
        if (num === 0) {
            this.dialogRef.close({status: 'OK'});
        } else {
            this.dialogRef.close();
        }
    }
}


