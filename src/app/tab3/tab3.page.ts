import {Component, OnInit, NgZone, ChangeDetectorRef, Input, Output, EventEmitter} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {StorageService} from '../shared/services/storage.service';
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera/ngx';
import {ActionSheetController, AlertController, Platform} from '@ionic/angular';
import {Crop} from '@ionic-native/crop/ngx';
import {Router} from '@angular/router';
import {Tab3Service} from './tab3.service';
import {InventoryModel} from '../shared/models/InventoryModel';
import {ProfileImageService} from '../shared/services/profile-image.service';
import {WizardService} from '../shared/authentication/signup-wizard/wizard.service';
import {MatDialog} from '@angular/material';
import {GunlistComponent} from './gunlist/gunlist.component';
import {SightlistComponent} from './sightlist/sightlist.component';
import {SelectTargetComponent} from '../shared/select-target-modal/select-target-component';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {SelectTargetModalComponent} from '../shared/select-target-modal/modal/select-target-modal.component';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
    @Output() move: EventEmitter<any> = new EventEmitter<any>();
    @Output() stepThreeComplete: EventEmitter<any> = new EventEmitter<any>();
    @Input() form: any;

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
    showState = false;
    private registerForm: any;
    submitted;

    constructor(private storageService: StorageService,
                private ref: ChangeDetectorRef,
                private crop: Crop,
                private formBuilder: FormBuilder,
                private router: Router,
                private platform: Platform,
                private actionSheetController: ActionSheetController,
                private camera: Camera,
                private alertCtrl: AlertController,
                private tab3Service: Tab3Service,
                public domSanitizer: DomSanitizer,
                private wizardService: WizardService,
                public dialog: MatDialog
    ) {
        if (this.router.url === '/home/tabs/tab3') {
            this.showHeader = true;
        } else {
            this.isFromWizard = true;
        }

        this.registerForm = this.formBuilder.group({
            first_name: ['', Validators.required],
            age: [],
            gender: [],
            country: [],
            state: [],
            last_name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
        });
    }

    ionViewDidEnter() {
        this.initActctions();
    }

    initActctions() {

        this.profile = this.storageService.getItem('profileData');
        const inventory: InventoryModel = this.storageService.getItem('inventory');
        const target = this.storageService.getItem('personalTarget');
        if (!inventory) {
            this.myGuns = null;
            this.mySights = null;
        } else {
            this.myGuns = inventory.wepons;
            this.mySights = inventory.sight;
        }
        if (target) {
            this.myTarget = target;
        }
        if (!this.profile) {
            this.profile = {};
        }

        this.tab3Service.passProfileFromRegister.subscribe(profile => {
            if (profile) {
                this.profile = profile;
            }
        });
    }

    ngOnInit(): void {
        if (!this.form) {
            this.form = {};
        }
        this.initActctions();
        this.form.age = null;
        this.form.country = null;
        this.form.state = null;
        this.form.gendre = 'Male';
    }

    onSelectWeapons() {
        const dialogRef = this.dialog.open(GunlistComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'dialog-bg'
        });

        dialogRef.afterClosed().subscribe(result => {
            this.myGuns = this.storageService.getItem('inventory').wepons;
        });
    }

    onSelectSights() {
        const dialogRef = this.dialog.open(SightlistComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'dialog-bg'
        });

        dialogRef.afterClosed().subscribe(result => {
            this.mySights = this.storageService.getItem('inventory').sight;
        });
    }

    onSaveProfile() {
        this.isEditMode = false;
        this.storageService.setItem('profileData', this.profile);
    }

    async onSelectTarget() {
        this.wizardService.selectTargetFromWizardOpened.next(true);
        const dialogRef = this.dialog.open(SelectTargetModalComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: {
                isFromWizard: true
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.myTarget = this.storageService.getItem('personalTarget');
        });
    }

    async selectImage() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Select Image source',
            buttons: [{
                text: 'Load from Library',
                handler: () => {
                    this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.pickImage(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }


    finishWizard() {
        if (this.router.url === '/home/tabs/tab3') {
            // update user.
        } else {
            this.form.sights = this.mySights;
            this.form.weapons = this.myGuns;
            this.form.target = this.myTarget;
            this.form.profilePicture = this.profile.picture;
            this.wizardService.moreInfoForm = this.form;
            this.wizardService.registerUser();
            this.move.emit();
        }

    }

    onHideTargets() {
        this.selectTarget = false;
        this.myTarget = this.storageService.getItem('target');

    }

    onCountrySelected(value: string) {
        if (value === 'United States of America') {
            this.showState = true;
            this.form.country = value;
        }
    }

    onStateSelected(value: string) {
        this.form.state = value;
    }

    onGenderSelected(value: string) {
    }

    pickImage(sourceType) {
        const options: CameraOptions = {
            quality: 100,
            sourceType,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
        };
        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            const base64Image = 'data:image/jpeg;base64,' + imageData;
            this.profile.picture = base64Image;
            this.ref.detectChanges();
            return base64Image;
        }, (err) => {
            console.log(err);
        });
    }

    get f() {
        return this.registerForm.controls;
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

    onBackPressed() {

    }

    onSubmit() {

    }
}

