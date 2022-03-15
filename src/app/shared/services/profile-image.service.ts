import {Injectable} from '@angular/core';
import {ActionSheetController} from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';

@Injectable({
    providedIn: 'root'
})
export class ProfileImageService {
    private picture: any;

    constructor(private actionSheetController: ActionSheetController, private camera: Camera) {
    }


}
