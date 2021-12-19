import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface ImodalType {
    modalType: Itypes;
}

export interface Itypes {
    wifi: string;
    blueTooth: string;
    general: string;
}

@Component({
    selector: 'app-error-modal',
    templateUrl: './error-modal.component.html',
    styleUrls: ['./error-modal.component.scss'],
})

export class ErrorModalComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<ErrorModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ImodalType) {
    }


    ngOnInit() {
    }

    closeModal() {
        this.dialogRef.close();
    }
}
