import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {MatExpansionModule, MatMenuModule} from '@angular/material';
import {ApiService} from './services/api.service';
import {UserService} from './services/user.service';
import {MaterialModule} from './material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProfileImageService} from './services/profile-image.service';
import {Tab3Page} from '../tab3/tab3.page';
import {GunlistComponent} from '../tab3/gunlist/gunlist.component';
import {SightlistComponent} from '../tab3/sightlist/sightlist.component';
import {StorageService} from './services/storage.service';
import {Camera} from '@ionic-native/camera/ngx';
import {Crop} from '@ionic-native/crop/ngx';
import {File} from '@ionic-native/file/ngx';
import {HitNohitService} from './drill/hit-nohit.service';
import {TermsAndConditionComponent} from './components/terms-and-condition/terms-and-condition.component';
import {SelectTargetModalComponent} from './select-target-modal/select-target-modal.component';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';

@NgModule({
    declarations: [Tab3Page, GunlistComponent, SightlistComponent, TermsAndConditionComponent, SelectTargetModalComponent],
    entryComponents: [],
    imports: [
        CommonModule,
        MatMenuModule,
        MatExpansionModule,
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [HitNohitService, ApiService, UserService, ProfileImageService, StorageService, Camera, Crop, File, ScreenOrientation],
    exports: [MaterialModule,
        MatMenuModule,
        MatExpansionModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        SelectTargetModalComponent,
        Tab3Page, GunlistComponent, SightlistComponent
    ],

})
export class SharedModule {
}




