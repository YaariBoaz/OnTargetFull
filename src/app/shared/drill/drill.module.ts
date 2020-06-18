import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DrillComponent} from './drill.component';
import {SharedModule} from '../shared.module';


@NgModule({
    declarations: [DrillComponent],
    imports: [
        CommonModule,
        SharedModule
    ],
    providers: [],
    exports: [DrillComponent]
})
export class DrillModule {
}
