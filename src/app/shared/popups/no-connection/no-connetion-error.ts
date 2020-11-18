import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

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
    templateUrl: './no-connetion-error.component.html',
    styleUrls: ['./no-connetion-error.scss'],
})

export class NoConnetionErroComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<NoConnetionErroComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ImodalType) {
    }


    ngOnInit() {
    }

    closeModal() {
        this.dialogRef.close();
    }
}

