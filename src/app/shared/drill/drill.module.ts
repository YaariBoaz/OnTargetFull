import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DrillComponent} from './drill.component';
import {SharedModule} from '../shared.module';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {NgPipesModule} from 'ngx-pipes';
import {ReversePipe} from './reverseArray';


// @ts-ignore
@NgModule({
    declarations: [DrillComponent, ReversePipe],
    imports: [
        CommonModule,
        SharedModule,
        NgPipesModule
    ],
    providers: [ScreenOrientation],
    exports: [DrillComponent]
})
export class DrillModule {
}
