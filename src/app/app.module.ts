import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {StorageService} from './shared/services/storage.service';
import {InitService} from './shared/services/init.service';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), HttpClientModule, AppRoutingModule, BrowserAnimationsModule],
    providers: [
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        InitService,
        StorageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
