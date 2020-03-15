import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TabsPageRoutingModule} from './tabs-routing.module';

import {TabsPage} from './tabs.page';
import {MatMenuModule} from '@angular/material';
import {TabsService} from './tabs.service';




@NgModule({
    imports: [
        IonicModule,
        CommonModule,
         FormsModule,
        TabsPageRoutingModule,
        MatMenuModule,
     ],
    providers: [TabsService],
    declarations: [TabsPage],
    exports: []
})
export class TabsPageModule {
}
