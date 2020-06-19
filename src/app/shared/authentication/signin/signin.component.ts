import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {trigger, transition, useAnimation} from '@angular/animations';
import {StorageService} from '../../services/storage.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {ApiService} from '../../services/api.service';


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

    constructor(
        private router: Router,
        private storageService: StorageService,
        private apiService: ApiService,
        public alertController: AlertController,
        public loadingController: LoadingController,
    ) {


    }

    ionViewDidLoad() {

    }

    ngOnInit() {

        setTimeout(() => {
            if (this.storageService.getItem('isLoggedIn')) {
                this.splash = false;
                // this.router.navigateByUrl('/home/tabs/tab1');
            } else {
                this.splash = false;
            }
        }, 5000);
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
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            duration: 2000
        });
        await loading.present();
        this.apiService.login({
            username: this.userName,
            password: this.password
        }).subscribe(data => {
            this.storageService.setItem('isLoggedIn', true);
            this.storageService.setItem('profileData', data);
            this.router.navigateByUrl('/home/tabs/tab1');
        });
    }

    backToSignin() {
        this.router.navigateByUrl('wizard');
    }
}
