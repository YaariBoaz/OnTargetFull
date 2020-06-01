import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Tab1Page} from './tab1.page';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ChartsModule} from 'ng2-charts';
import {SharedModule} from '../shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatAccordion, MatExpansionModule, MatMenuModule} from '@angular/material';
import {Camera} from '@ionic-native/camera/ngx';
import {Tab3Service} from '../tab3/tab3.service';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        NgxChartsModule,
        SharedModule,
        ChartsModule,
        MatIconModule,
        MatMenuModule,
        RouterModule.forChild([
            {path: '', component: Tab1Page},
            {
                path: 'activity-history',
                loadChildren: () => import('../shared/activity-history/activity-history.module.js').then(m => m.ActivityHistoryModule)
            },
        ])
    ],
    providers: [Camera, Tab3Service],
    declarations: [Tab1Page],

})
export class Tab1PageModule {
}
