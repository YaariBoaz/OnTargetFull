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


    async selectImage() {
        // const actionSheet = await this.actionSheetController.create({
        //     header: 'Select Image source',
        //     buttons: [{
        //         text: 'Load from Library',
        //         handler: () => {
        //             this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        //         }
        //     },
        //         {
        //             text: 'Use Camera',
        //             handler: () => {
        //                 this.pickImage(this.camera.PictureSourceType.CAMERA);
        //             }
        //         },
        //         {
        //             text: 'Cancel',
        //             role: 'cancel'
        //         }
        //     ]
        // });
        // await actionSheet.present();
    }


    pickImage(sourceType) {
        // const options: CameraOptions = {
        //     quality: 100,
        //     sourceType,
        //     destinationType: this.camera.DestinationType.DATA_URL,
        //     encodingType: this.camera.EncodingType.JPEG,
        //     mediaType: this.camera.MediaType.PICTURE
        // };
        // this.camera.getPicture(options).then((imageData) => {
        //     // imageData is either a base64 encoded string or a file URI
        //     // If it's base64 (DATA_URL):
        //     const base64Image = 'data:image/jpeg;base64,' + imageData;
        //     return base64Image;
        // }, (err) => {
        //     console.log(err);
        // });
    }

}
