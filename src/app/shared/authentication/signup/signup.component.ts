import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {StorageService} from '../../services/storage.service';
import {ApiService} from '../../services/api.service';
import {ActionSheetController, AlertController, LoadingController, Platform} from '@ionic/angular';
import {Tab3Service} from '../../../tab3/tab3.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ProfileImageService} from '../../services/profile-image.service';
import {WizardService} from '../signup-wizard/wizard.service';

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

    constructor(private apiService: ApiService,
                public loadingController: LoadingController,
                private router: Router,
                private formBuilder: FormBuilder,
                private platform: Platform,
                private tab3Service: Tab3Service,
                private ref: ChangeDetectorRef,
                private wizardService: WizardService,
                public domSanitizer: DomSanitizer,
                private storageService: StorageService,
                private actionSheetController: ActionSheetController,
                private camera: Camera,
                public alertController: AlertController) {
        this.back = new EventEmitter();
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: new FormControl(null, [Validators.required])
        }, {validator: this.passwordConfirming});
        if (this.wizardService.registerForm) {
            this.registerForm = this.wizardService.registerForm;
        }
    }


    get f() {
        return this.registerForm.controls;
    }

    async onSubmit() {

    }


    async notifyError() {
        const alert = await this.alertController.create({
            header: 'Registration Error',
            message: this.errorMessage.error.message,
            buttons: ['OK']
        });

        await alert.present();
    }


    onBackPressed(page) {
        this.back.emit(page);
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


    async pickImage(sourceType) {
        const options: CameraOptions = {
            quality: 100,
            sourceType,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true
        };
        const loading = await this.loadingController.create({
            message: 'Adding you to the system, please wait',
            duration: 1000000000,
        });
        await loading.present();

        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            const base64Image = 'data:image/jpeg;base64,' + imageData;
            this.showCroppedImage(base64Image, loading);

        }, (err) => {
            console.log(err);
        });
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

    continueToThird() {
        this.stepTwoComplete.emit(this.registerForm);
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.registerForm.value.img_path = this.picture;
        if (this.registerForm.value.age) {
            this.registerForm.value.age = this.registerForm.value.age.toString();
        }

        this.wizardService.registerForm = this.registerForm;
        this.tab3Service.passProfileFromRegister.next(this.registerForm.value);
        this.stepTwoComplete.emit(this.registerForm);
    }


    passwordConfirming(c: AbstractControl): { invalid: boolean } {
        if (c.get('password').value !== c.get('confirmPassword').value) {
            return {invalid: true};
        }
    }
}
