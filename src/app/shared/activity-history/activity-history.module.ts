import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivityHistoryComponent} from './activity-history.component';
import {SharedModule} from '../shared.module';


@NgModule({
    declarations: [],
    exports: [ ],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class ActivityHistoryModule {
}
