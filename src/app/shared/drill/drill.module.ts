import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DrillComponent} from './drill.component';
import {SharedModule} from '../shared.module';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {ReversePipe} from './reverseArray';
import {NgxTimerModule} from 'ngx-timer';


// @ts-ignore
@NgModule({
    declarations: [DrillComponent, ReversePipe],
    imports: [
        CommonModule,
        SharedModule,
        NgxTimerModule,
    ],
    providers: [ScreenOrientation],
    exports: [DrillComponent]
})
export class DrillModule {
}
