import {Component, OnInit, NgZone, ChangeDetectorRef} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {StorageService} from '../shared/services/storage.service';


@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
    croppedImagepath;
    profile;
    images;
    index = 0;
    ip: any;
    isGunList = false;
    isSightList = false;

    myGuns = null;
    mySights = null;
    myTargets = null;
    isEditMode = false;


    constructor(private storageService: StorageService, private ref: ChangeDetectorRef) {
    }

    ionViewDidEnter() {
        this.profile = this.storageService.getItem('profileData');
        this.myGuns = this.storageService.getItem('gunList');
        this.mySights = this.storageService.getItem('sightList');
        this.myTargets = this.storageService.getItem('myTargets');
        if (!this.profile) {
            this.profile = {};
        }
    }

    ngOnInit(): void {

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
        //     let base64Image = 'data:image/jpeg;base64,' + imageData;
        //     this.showCroppedImage(base64Image);
        //
        // }, (err) => {
        //     // Handle error
        // });
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

    // shareEmail(item) {
    //     const body = ' Dear ' + item.data.fullName + '.' + '\r\n' +
    //         'It was great fun shooting with you at the range.' + '\r\n' +
    //         'We attached your session from today for you to keep, share and see our capabilities.' + '\r\n' +
    //         'Please visit our website ( https://www.adlsmartshooting.com/ ) and contact us for any more questions.' + '\r\n' +
    //         'don\'t forget to follow us on Instagram and tag @adlontarget' + '\r\n' +
    //         'Best regards.';
    //
    //     this.storage.get('adl-contacts').then((storageData) => {
    //         this.emailComposer.isAvailable().then((available: boolean) => {
    //             if (available) {
    //                 const email = {
    //                     to: item.data.email,
    //                     subject: 'Your results from ADL Smart Shooting Target',
    //                     body,
    //                     attachments: [
    //                         item.urlForUpload
    //                     ],
    //                 };
    //
    //                 this.emailComposer.open(email);
    //             }
    //         });
    //     });
    // }

    // shareInstagram(item) {
    //     this.socialSharing.shareViaInstagram('Hello', item.urlForUpload).then(() => {
    //
    //     }).catch((e) => {
    //         alert(e);
    //         // Sharing via email is not possible
    //     });
    //
    // }
    //
    // shareFacebook(item) {
    //     this.socialSharing.shareViaFacebook('This is My Shots..', item.urlForUpload, item.urlForUpload).then(() => {
    //
    //     });
    // }

    onRefresh() {

    }

    onSelectWeapons() {
        this.isGunList = true;
    }

    onHidetWeapons() {
        this.isGunList = false;
        this.myGuns = this.storageService.getItem('gunList');
    }

    onSelectSights() {
        this.isSightList = true;
    }

    onHideSights() {
        this.isSightList = false;
        this.mySights = this.storageService.getItem('sightList');

    }


    cropImage(fileUrl) {
        // this.crop.crop(fileUrl, {quality: 100})
        //     .then(
        //         newPath => {
        //             this.showCroppedImage(newPath.split('?')[0]);
        //         },
        //         error => {
        //             alert('Error cropping image' + error);
        //         }
        //     );
    }

    showCroppedImage(ImagePath) {
        this.profile.picture = ImagePath;
        this.storageService.setItem('profile', this.profile);
        this.ref.detectChanges();
    }


    onSaveProfile() {
        this.isEditMode = false;
        // this.storageService.setItem('prfile', this.profile);
    }

    async onSelectTarget() {
        // const alert = await this.alertCtrl.create({
        //     header: 'Set Target IP',
        //     inputs: [
        //         {
        //             name: 'Number',
        //             placeholder: 'Last 3 digits of IP'
        //         },
        //     ],
        //     buttons: [
        //         {
        //             text: 'Save',
        //             handler: data => {
        //                 let targetList = this.storageService.getItem('targetList');
        //                 if (!targetList) {
        //                     targetList = [];
        //                 }
        //                 targetList.push(data.Number);
        //                 this.myTargets = targetList;
        //                 this.storageService.setItem('targetList', targetList);
        //                 this.ref.detectChanges();
        //             }
        //         }
        //     ]
        // });
        // alert.present();
    }
}

