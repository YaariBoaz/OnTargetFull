import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivityHistoryComponent} from '../activity-history/activity-history.component';
import {SinginModule} from '../authentication/singin/singin.module';
import {SelectTargetModalComponent} from '../select-target-modal/select-target-modal.component';
import {ShootingComponent} from '../shooting-component/shooting.component';
import {IonicModule} from '@ionic/angular';
import {MatExpansionModule, MatMenuModule} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import {FormsModule} from '@angular/forms';
import {ShootingService} from './shooting.service';
import {NetworkService} from './network.service';
import {ApiService} from './api.service';
import {UserService} from './user.service';

@NgModule({
    declarations: [ActivityHistoryComponent, SelectTargetModalComponent, ShootingComponent],
    entryComponents: [ActivityHistoryComponent, SelectTargetModalComponent, ShootingComponent],
    exports: [ActivityHistoryComponent, SelectTargetModalComponent, ShootingComponent],
    imports: [
        CommonModule,
        SinginModule,
        MatMenuModule,
        MatExpansionModule,
        IonicModule.forRoot(),
        FormsModule,
        HttpClientModule
    ],
    providers: [ShootingService, NetworkService, ApiService, UserService]
})
export class SharedModule {
}
