import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectTargetModalComponent} from './select-target-modal.component';
import {SharedModule} from '../shared.module';


@NgModule({
    declarations: [SelectTargetModalComponent],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class TargetSelectionModule {
}
