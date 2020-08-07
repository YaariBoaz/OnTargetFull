import {Component, OnInit, NgZone, ChangeDetectorRef, Input, Output, EventEmitter} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {StorageService} from '../shared/services/storage.service';
import {Camera, CameraOptions} from '@ionic-native/Camera/ngx';
import {File} from '@ionic-native/file/ngx';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {Crop} from '@ionic-native/crop/ngx';
import {Base64} from '@ionic-native/base64/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import {Tab3Service} from './tab3.service';
import {InventoryModel} from '../shared/models/InventoryModel';
import {ProfileImageService} from '../shared/services/profile-image.service';
import {WizardService} from '../shared/authentication/signup-wizard/wizard.service';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
    @Output() move: EventEmitter<any> = new EventEmitter<any>();

    croppedImagepath;
    profile;
    images;
    index = 0;
    ip: any;
    isGunList = false;
    isSightList = false;

    myGuns = null;
    mySights = null;
    myTarget = null;
    isEditMode = false;
    selectTarget = false;
    showHeader = false;
    isFromWizard: boolean;

    constructor(private storageService: StorageService,
                private ref: ChangeDetectorRef,
                private crop: Crop,
                private router: Router,
                private alertCtrl: AlertController,
                private tab3Service: Tab3Service,
                public domSanitizer: DomSanitizer,
                private profileImageService: ProfileImageService,
                private wizardService: WizardService
    ) {
        if (this.router.url === '/home/tabs/tab3') {
            this.showHeader = true;
        } else {
            this.isFromWizard = true;
        }
    }

    ionViewDidEnter() {
        this.initActctions();
    }

    initActctions() {

        this.profile = this.storageService.getItem('profileData');
        const inventory: InventoryModel = this.storageService.getItem('inventory');
        if (!inventory) {
            this.myGuns = null;
            this.mySights = null;
        } else {
            this.myGuns = inventory.wepons;
            this.mySights = inventory.sight;
        }
        this.myTarget = this.storageService.getItem('target');
        if (!this.profile) {
            this.profile = {};
        }

        this.tab3Service.passProfileFromRegister.subscribe(profile => {
            if (profile) {
                this.profile = profile;
            }
        });

        // Remove this
        this.profile.email = 'evi@adl.solutions';
        this.profile.age = 35;
    }

    ngOnInit(): void {
        this.initActctions();
    }


    /*
          SOCIAL MEDIA SHARE CODE


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
    */


    onRefresh() {

    }

    onSelectWeapons() {
        this.isGunList = true;
    }

    onHidetWeapons() {
        const inventory: InventoryModel = this.storageService.getItem('inventory');
        this.isGunList = false;
        this.myGuns = inventory.wepons;
    }

    onSelectSights() {
        this.isSightList = true;
    }


    onHideSights() {
        const inventory: InventoryModel = this.storageService.getItem('inventory');
        this.isSightList = false;
        this.mySights = inventory.sight;
    }


    onSaveProfile() {
        this.isEditMode = false;
        this.storageService.setItem('profileData', this.profile);
    }

    async onSelectTarget() {
        this.selectTarget = true;
    }

    selectImage() {
        const image = this.profileImageService.selectImage();
        // this.registerForm.value.img_path = this.profileImageService.selectImage();
        this.ref.detectChanges();
    }


    finishWizard() {
        this.wizardService.registerUser();
        this.move.emit();
    }

    onHideTargets() {
        this.selectTarget = false;
        this.myTarget = this.storageService.getItem('target');

    }
}

