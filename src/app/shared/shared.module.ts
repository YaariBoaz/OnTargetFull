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
import {TargetListComponent} from '../tab3/target-list/target-list.component';
import {GunlistComponent} from '../tab3/gunlist/gunlist.component';
import {SightlistComponent} from '../tab3/sightlist/sightlist.component';
import {StorageService} from './services/storage.service';
import {Camera} from '@ionic-native/camera/ngx';
import {Crop} from '@ionic-native/crop/ngx';
import {File} from '@ionic-native/file/ngx';
import {HitNohitService} from './drill/hit-nohit.service';

@NgModule({
    declarations: [Tab3Page, TargetListComponent, GunlistComponent, SightlistComponent],
    entryComponents: [],
    imports: [
        CommonModule,
        MatMenuModule,
        MatExpansionModule,
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [HitNohitService, ApiService, UserService, ProfileImageService, StorageService, Camera, Crop, File],
    exports: [MaterialModule,
        MatMenuModule,
        MatExpansionModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        Tab3Page, TargetListComponent, GunlistComponent, SightlistComponent
    ],

})
export class SharedModule {
}


