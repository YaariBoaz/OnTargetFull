import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageService} from '../../services/storage.service';
import {ApiService} from '../../services/api.service';
import {ActionSheetController, AlertController, LoadingController, Platform} from '@ionic/angular';
import {Tab3Service} from '../../../tab3/tab3.service';
import {DomSanitizer} from '@angular/platform-browser';
import {WizardService} from '../signup-wizard/wizard.service';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';
import {Camera, CameraResultType, GalleryPhotos} from '@capacitor/camera';
import {TermsAndConditionComponent} from '../../components/terms-and-condition/terms-and-condition.component';
import {MatDialog} from '@angular/material/dialog';

const pickPicture = async () => {
    return await Camera.pickImages({
        quality: 90,
        limit: 1,
        presentationStyle: 'fullscreen'
    });
};

const takePicture = async () => {
    return await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl
    });
};

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})


export class SignupComponent implements OnInit {
    @Output() back: EventEmitter<any>;
    @Output() move: EventEmitter<any> = new EventEmitter<any>();
    @Output() backToFirst: EventEmitter<any> = new EventEmitter<any>();
    @Output() stepTwoComplete: EventEmitter<any> = new EventEmitter<any>();

    registerForm: FormGroup;
    submitted = false;
    errorMessage;
    picture: string;
    isEditMode = true;
    private showStates = false;
    fieldTextType: boolean;
    profile = {} as any;
    cities: any = ['Volusia Top Gun', 'Triple N Ranch Shooting Range', 'Full-Tilt Tactical'];

    constructor(private apiService: ApiService,
                public loadingController: LoadingController,
                private router: Router,
                private formBuilder: FormBuilder,
                private platform: Platform,
                private tab3Service: Tab3Service,
                private nativePageTransitions: NativePageTransitions,
                private ref: ChangeDetectorRef,
                private wizardService: WizardService,
                public domSanitizer: DomSanitizer,
                private storageService: StorageService,
                public dialog: MatDialog,
                private actionSheetController: ActionSheetController,
                public alertController: AlertController) {
        this.back = new EventEmitter();

        const dialogRef = this.dialog.open(TermsAndConditionComponent, {
            width: '100%',
            height: '100%',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result || !result.status || result.status !== 'OK') {
                this.onBackPressed();
            }
        });
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            cityName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
        }, {
            validator: this.mustMatch('password', 'confirmPassword')
        });


        if (this.wizardService.registerForm) {
            this.registerForm = this.wizardService.registerForm;
        }
    }

    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
    }


    ionViewWillLeave() {

        const options: NativeTransitionOptions = {
            direction: 'up',
            duration: 500,
            slowdownfactor: 3,
            slidePixels: 20,
            iosdelay: 100,
            androiddelay: 150,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 60
        };

        this.nativePageTransitions.slide(options)
            .then(() => {
            })
            .catch(() => {
            });

    }


    get f() {
        return this.registerForm.controls;
    }

    async onSubmit() {

    }

    changeCity(e) {
        this.cityName?.setValue(e.target.value, {
            onlySelf: true,
        });
    }

    get cityName() {
        return this.registerForm.get('cityName');
    }

    async notifyError() {
        const alert = await this.alertController.create({
            header: 'Registration Error',
            message: this.errorMessage.error.message,
            buttons: ['OK']
        });

        await alert.present();
    }


    onBackPressed() {
        this.back.emit();
    }

    pickImage(sourceType) {
         if (sourceType === 1) {
            takePicture().then(data => {
                const base64Image = data.dataUrl;
                (this.profile as any).picture = base64Image;
                this.wizardService.moreInfoForm.profilePicture = (this.profile as any).picture;
                this.ref.detectChanges();
                return base64Image;

            });
        } else {
            pickPicture().then((data: GalleryPhotos) => {
             });
        }
    }


    showCroppedImage(ImagePath, loading) {
        this.picture = ImagePath;
        this.registerForm.value.img_path = ImagePath;
        this.ref.detectChanges();
        loading.dismiss();
    }


    changeCountry($event: Event) {
        if ((($event.currentTarget[($event.currentTarget as any).selectedIndex].value) === 'United States of America')) {
            this.showStates = true;
        } else {
            this.showStates = false;
        }
    }


    changeState($event: Event) {

    }


    returnToPreviusStage() {
        this.backToFirst.emit(true);
    }

    async selectImage() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Select Image source',
            buttons: [{
                text: 'Load from Library',
                handler: () => {
                    this.pickImage(0);
                }
            },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.pickImage(1);
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

    continueToThird() {
        this.submitted = true;
        if (!this.registerForm.errors) {
            this.wizardService.registerForm = this.registerForm;
            this.tab3Service.passProfileFromRegister.next(this.registerForm.value);
            this.stepTwoComplete.emit(this.registerForm);
        } else {
            // tslint:disable-next-line:no-unused-expression
            false;
        }
    }


    mustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator has already found an error on the matchingControl
                return;
            }

            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({mustMatch: true});
            } else {
                matchingControl.setErrors(null);
            }
        };
    }


    passwordConfirming(c: AbstractControl): { invalid: boolean } {
        if (c.get('password').value !== c.get('confirmPassword').value) {
            return {invalid: true};
        }
    }


}
