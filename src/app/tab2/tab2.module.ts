import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Tab2Page} from './tab2.page';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {SelectTargetModalComponent} from '../shared/select-target-modal/select-target-modal.component';
import {DrillComponent} from '../shared/drill/drill.component';
import {SharedModule} from '../shared/shared.module';
import {TargetSelectionModule} from '../shared/select-target-modal/target-selection.module';
import {DrillModule} from '../shared/drill/drill.module';

// @ts-ignore
// @ts-ignore
// @ts-ignore
@NgModule({
    imports: [
        IonicModule,
        MatIconModule,
        CommonModule,
        FormsModule,
        SharedModule,
        MatMenuModule,
        TargetSelectionModule,
        DrillModule,
        RouterModule.forChild([
            {path: '', component: Tab2Page},
            {path: 'select', component: SelectTargetModalComponent},
            {path: 'select2', component: DrillComponent}])
    ],
    providers: [/*Screenshot*/],
    declarations: [Tab2Page],
    entryComponents: [],
})
export class Tab2PageModule {
}
