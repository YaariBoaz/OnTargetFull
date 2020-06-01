import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DrillComponent} from './drill.component';
import {SharedModule} from '../shared.module';
import {HitNohitService} from './hit-nohit.service';


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
