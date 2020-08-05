import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {trigger, transition, useAnimation} from '@angular/animations';
import {StorageService} from '../../services/storage.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {ApiService} from '../../services/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';


@Component({
    selector: 'app-singin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
    splash = true;
    isSignIn = true;
    userName;
    password;
    socket;
    isFirstLoad = true;
    registerForm: FormGroup;
    submitted = false;

    constructor(
        private router: Router,
        private storageService: StorageService,
        private apiService: ApiService,
        public alertController: AlertController,
        public loadingController: LoadingController,
        private formBuilder: FormBuilder,
        private userService: UserService
    ) {


    }

    ionViewDidLoad() {

    }

    get f() {
        return this.registerForm.controls;
    }


    ngOnInit() {
        if (this.storageService.getItem('isLoggedIn')) {
            this.router.navigateByUrl('/home/tabs/tab1');
        }
        this.registerForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }


    async onFBClick() {
        // this.fb.login(['public_profile', 'email'])
        //     .then((response: FacebookLoginResponse) => {
        //         if (response.authResponse.userID !== '') {
        //             this.fb.api(
        //                 // tslint:disable-next-line:max-line-length
        //                 'me?fields=id,name,email,first_name,last_name,picture.width(600).height(600).as(picture_small),picture.width(360).height(360).as(picture_large)',
        //                 [])
        //                 .then((profileData) => {
        //                     profileData.picture = 'https://graph.facebook.com/' + profileData.id + '/picture?width=1024&height=1024';
        //                     this.storageService.setItem('profileData', profileData);
        //                     this.storageService.setItem('isLogedIn', true);
        //                     this.router.navigateByUrl('/home/tabs/tab1');
        //                 }, (err) => {
        //                     this.showAlert();
        //                 });
        //         }
        //         console.log('Logged into Facebook!', response);
        //     })
        //     .catch(e => {
        //         console.log('Error logging into Facebook', e);
        //     });
        // this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
    }

    async showAlert() {
        const alert = await this.alertController.create({
            header: 'Alert',
            subHeader: 'Subtitle',
            message: 'This is an alert message.',
            buttons: ['OK']
        });
        alert.present();
    }

    goToSignUp() {
        this.router.navigateByUrl('wizard');
    }

    async onLogin() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        } else {
            const loading = await this.loadingController.create({
                message: 'Please wait...',
                duration: 2000
            });
            await loading.present();
            this.apiService.login({
                username: this.registerForm.value.email,
                password: this.registerForm.value.password
            }).subscribe(data => {
                this.userService.setUser(data);
                this.apiService.getDashboardData(this.userService.getUserId());
                this.storageService.setItem('isLoggedIn', true);
                this.storageService.setItem('profileData', data);
                this.router.navigateByUrl('/home/tabs/tab1');
            });
        }

    }

    backToSignin() {
        this.router.navigateByUrl('wizard');
    }
}
