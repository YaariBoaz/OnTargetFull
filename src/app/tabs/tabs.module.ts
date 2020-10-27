import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TabsPageRoutingModule} from './tabs-routing.module';

import {TabsPage} from './tabs.page';
import {MatMenuModule} from '@angular/material';
import {TabsService} from './tabs.service';
import {Tab1PageModule} from '../tab1/tab1.module';
import {Tab2PageModule} from '../tab2/tab2.module';
import {Tab3PageModule} from '../tab3/tab3.module';
import {SharedModule} from '../shared/shared.module';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TabsPageRoutingModule,
        MatMenuModule,
        Tab1PageModule,
        Tab2PageModule,
        Tab3PageModule,
        SharedModule
    ],
    providers: [TabsService],
    declarations: [TabsPage],
    exports: []
})
export class TabsPageModule {
}
