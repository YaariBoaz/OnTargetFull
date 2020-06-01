import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {BluetoothSerial} from '@ionic-native/bluetooth-serial/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {StorageService} from './shared/services/storage.service';
import {InitService} from './shared/services/init.service';
import {Tab1Service} from './tab1/tab1-service.service';
import {UserService} from './shared/services/user.service';
import {BLE} from '@ionic-native/ble/ngx';
import {MaterialModule} from './shared/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from './shared/shared.module';
import {Camera} from '@ionic-native/camera/ngx';
import {GlobalErrorHandler} from './core/errors.service';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, ReactiveFormsModule, SharedModule
        , FormsModule, IonicModule.forRoot(), HttpClientModule, AppRoutingModule, BrowserAnimationsModule, MaterialModule],
    providers: [
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        InitService,
        StorageService,
        Tab1Service,
        UserService,
        BLE,
        BluetoothSerial,
        Camera,
        {provide: ErrorHandler, useClass: GlobalErrorHandler}
    ],
    exports: [MaterialModule],
    bootstrap: [AppComponent]
})
export class AppModule {
}
