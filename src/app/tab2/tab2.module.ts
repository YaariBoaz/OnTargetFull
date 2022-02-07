import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Tab2Page} from './tab2.page';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {SelectTargetComponent} from '../shared/select-target-modal/select-target-component';
import {DrillComponent} from '../shared/drill/drill.component';
import {SharedModule} from '../shared/shared.module';
import {DrillModule} from '../shared/drill/drill.module';
import {BalisticCalculatorComponent} from './balistic-calculator/balistic-calculator.component';
import {ChooseDrillComponent} from '../shared/ChooseDrill/choose-drill.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MaterialModule} from '../shared/material/material.module';

// @ts-ignore
// @ts-ignore
// @ts-ignore
@NgModule({
    imports: [
        IonicModule,
        MatIconModule,
        CommonModule,
        FormsModule,
        MaterialModule,
        SharedModule,
        MatMenuModule,
        DrillModule,
        RouterModule.forChild([
            {path: '', component: SelectTargetComponent},
            {path: 'select', component: Tab2Page},
            {path: 'select2', component: DrillComponent}])
    ],
    providers: [],
    declarations: [Tab2Page, BalisticCalculatorComponent, ChooseDrillComponent],
    entryComponents: [],
    exports: [
        Tab2Page
    ]
})
export class Tab2PageModule {
}
