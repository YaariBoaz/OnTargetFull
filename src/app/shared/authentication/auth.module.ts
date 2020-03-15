import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SinginComponent} from './singin/singin.component';
import {AuthRouting} from './auth.routing';
import {IonicModule} from '@ionic/angular';
import {SignupComponent} from './signup/signup.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StorageService} from '../services/storage.service';
import {SocialLoginModule, AuthServiceConfig, FacebookLoginProvider} from 'angularx-social-login';
import {Facebook} from '@ionic-native/facebook/ngx';

@NgModule({
    declarations: [SinginComponent, SignupComponent],
    imports: [SocialLoginModule, IonicModule, AuthRouting, CommonModule, FormsModule, ReactiveFormsModule],
    providers: [StorageService, Facebook],
    entryComponents: []
})
export class AuthModule {
}

