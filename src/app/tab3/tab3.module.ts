import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Tab3Page} from './tab3.page';
import {CDVPhotoLibraryPipe} from './ImagePipe';
import {GunlistComponent} from './gunlist/gunlist.component';
import {SightlistComponent} from './sightlist/sightlist.component';
import {MatMenuModule} from '@angular/material/menu';
import {SharedModule} from '../shared/shared.module';
import {StorageService} from '../shared/services/storage.service';
import {Camera} from '@ionic-native/Camera/ngx';
import {File} from '@ionic-native/file/ngx';
import {Crop} from '@ionic-native/crop/ngx';

// @ts-ignore
@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        SharedModule,
        MatMenuModule,
        // IonicStorageModule.forRoot(),
        RouterModule.forChild([{path: '', component: Tab3Page}])
    ],
    providers: [StorageService, Camera, Crop, File],
    declarations: [CDVPhotoLibraryPipe],
    exports: [],
    entryComponents: [GunlistComponent, SightlistComponent]
})
export class Tab3PageModule {
}
