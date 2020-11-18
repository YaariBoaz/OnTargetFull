import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {StorageService} from '../shared/services/storage.service';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ActionSheetController, AlertController, Platform} from '@ionic/angular';
import {Crop} from '@ionic-native/crop/ngx';
import {Router} from '@angular/router';
import {Tab3Service} from './tab3.service';
import {InventoryModel} from '../shared/models/InventoryModel';
import {WizardService} from '../shared/authentication/signup-wizard/wizard.service';
import {MatDialog} from '@angular/material';
import {GunlistComponent} from './gunlist/gunlist.component';
import {SightlistComponent} from './sightlist/sightlist.component';
import {FormBuilder, Validators} from '@angular/forms';
import {SelectTargetModalComponent} from '../shared/select-target-modal/modal/select-target-modal.component';
import {InitService} from '../shared/services/init.service';
import {ErrorModalComponent} from '../shared/popups/error-modal/error-modal.component';
import {TabsService} from '../tabs/tabs.service';


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
    hasError = true;
    myGuns = null;
    mySights = null;
    myTarget = null;
    isEditMode = false;
    selectTarget = false;
    showHeader = false;
    isFromWizard: boolean;
    showState = false;
    registerForm: any;
    submitted;

    constructor(private storageService: StorageService,
                private ref: ChangeDetectorRef,
                private tabService: TabsService,
                private crop: Crop,
                private formBuilder: FormBuilder,
                private router: Router,
                private platform: Platform,
                private actionSheetController: ActionSheetController,
                private camera: Camera,
                private alertCtrl: AlertController,
                private tab3Service: Tab3Service,
                public domSanitizer: DomSanitizer,
                private initService: InitService,
                private wizardService: WizardService,
                public dialog: MatDialog) {
        if (this.router.url === '/home') {
            this.showHeader = true;
            this.isFromWizard = false;

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

        this.tabService.$notifyTab3.subscribe(flag => {
            if (flag) {
                this.initActctions();
            }
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

        if (this.profile.firstName) {
            this.registerForm.get('first_name').setValue(this.profile.firstName);
        } else {
            this.registerForm.get('first_name').setValue(this.profile.first_name);
        }


        if (this.profile.lastnName) {
            this.registerForm.get('last_name').setValue(this.profile.firstName);
        } else {
            this.registerForm.get('last_name').setValue(this.profile.last_name);
        }
        this.registerForm.get('gender').setValue(this.profile.gender);
        this.registerForm.get('country').setValue(this.profile.country);
        this.registerForm.get('state').setValue(this.profile.state);
        this.registerForm.get('email').setValue(this.profile.email);


        this.ref.detectChanges();
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
        if (this.router.url === '/home') {
            // update user.
        } else {
            this.form.sights = this.mySights;
            this.form.weapons = this.myGuns;
            this.form.target = this.myTarget;
            this.form.profilePicture = this.profile.picture;
            this.wizardService.moreInfoForm = this.form;
            console.log('In finishWizard' + new Date());
            this.initService.isLoading.next(true);
            this.wizardService.registerUser();
            this.initService.notifyError.subscribe((error) => {
                if (error) {
                    const dialogRef = this.dialog.open(ErrorModalComponent, {
                        data: {modalType: 'general'}
                    });
                }
            });
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

    onGenderSelected(value) {
        this.registerForm.get('gender').setValue(value);
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

    getPlarform() {
        return this.platform.is('ios');
    }

    isTab3() {
        return this.router.url === '/home';
    }

    onSaveChanges() {

    }
}

