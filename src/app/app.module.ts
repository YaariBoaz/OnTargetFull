import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {BluetoothSerial} from '@ionic-native/bluetooth-serial/ngx';
import {BluetoothLE} from '@ionic-native/bluetooth-le/ngx';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {StorageService} from './shared/services/storage.service';
import {InitService} from './shared/services/init.service';
import {Tab1Service} from './tab1/tab1-service.service';
import {UserService} from './shared/services/user.service';
import {BLE} from '@ionic-native/ble/ngx';
 import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from './shared/shared.module';
import {Camera} from '@ionic-native/camera/ngx';
import {CdTimerModule} from 'angular-cd-timer';
import {BleService} from './shared/services/ble.service';
import {Crop} from '@ionic-native/crop/ngx';
import {SelectTargetComponent} from './shared/select-target-modal/select-target-component';
import {CommonModule} from '@angular/common';
import {GatewayService} from './shared/services/gateway.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpErrorInterceptor} from './shared/services/interceptor.service';
import {TabsPageModule} from './tabs/tabs.module';
import {NoConnetionErroComponent} from './shared/popups/no-connection/no-connetion-error';
import {ErrorModalComponent} from './shared/popups/error-modal/error-modal.component';
import {NativePageTransitions} from '@ionic-native/native-page-transitions/ngx';
import { MaterialModule } from './shared/material/material.module';


// @ts-ignore
@NgModule({
    declarations: [AppComponent],
    entryComponents: [ErrorModalComponent],
    imports: [
        BrowserModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        CdTimerModule,
        FormsModule,
        IonicModule.forRoot(),
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        TabsPageModule,
        MaterialModule

    ],
    providers: [
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        InitService,
        NativePageTransitions,
        StorageService,
        Tab1Service,
        UserService,
        BLE,
        BluetoothSerial,
        Camera,
        GatewayService,
        BleService,
        Crop,
        BluetoothLE,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true,
            deps: [InitService]
        }
    ],
    exports: [MaterialModule],
    bootstrap: [AppComponent]
})
export class AppModule {
}
