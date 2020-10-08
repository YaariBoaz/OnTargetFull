import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {MatExpansionModule, MatMenuModule} from '@angular/material';
import {ApiService} from './services/api.service';
import {UserService} from './services/user.service';
import {MaterialModule} from './material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Tab3Page} from '../tab3/tab3.page';
import {GunlistComponent} from '../tab3/gunlist/gunlist.component';
import {SightlistComponent} from '../tab3/sightlist/sightlist.component';
import {StorageService} from './services/storage.service';
import {HitNohitService} from './drill/hit-nohit.service';
import {TermsAndConditionComponent} from './components/terms-and-condition/terms-and-condition.component';
import {SelectTargetComponent} from './select-target-modal/select-target-component';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {SelectTargetModalComponent} from './select-target-modal/modal/select-target-modal.component';
import {ErrorModalComponent} from "../shared/popups/error-modal/error-modal.component";
import {AccessModalComponent} from "../shared/popups/access-modal/access-modal.component";

@NgModule({
    declarations: [Tab3Page, AccessModalComponent, GunlistComponent, SightlistComponent, TermsAndConditionComponent, SelectTargetComponent, SelectTargetModalComponent, ErrorModalComponent],

    imports: [
        CommonModule,
        MatMenuModule,
        MatExpansionModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [HitNohitService, ApiService, UserService, StorageService, ScreenOrientation],
    exports: [
        MaterialModule,
        MatMenuModule,
        MatExpansionModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        Tab3Page, GunlistComponent, SightlistComponent,
        SelectTargetModalComponent,
        ErrorModalComponent, AccessModalComponent
    ],


})
export class SharedModule {
}




