import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ImodalType} from '../error-modal/error-modal.component';


export interface ImodalType {
  modalType: Itypes;
}

export interface Itypes {
  wifi: string;
  blueTooth: string;
  general: string;
}



@Component({
  selector: 'app-signin-modal',
  templateUrl: './signin-modal.component.html',
  styleUrls: ['./signin-modal.component.scss'],
})
export class SigninModalComponent implements OnInit {

  constructor(
      public dialogRef: MatDialogRef<SigninModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: ImodalType) {
  }


  ngOnInit() {
  }

  closeModal() {
    this.dialogRef.close();
  }

}
