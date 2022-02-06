import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
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
import {ErrorModalComponent} from './popups/error-modal/error-modal.component';
import {AccessModalComponent} from './popups/access-modal/access-modal.component';
import {NoConnetionErroComponent} from './popups/no-connection/no-connetion-error';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import {ShareDialogComponent} from './share-dialog/share-dialog.component';
import {ChallengeListComponent} from './ChooseDrill/List/challenge-list.component';
import {PaymentComponent} from './components/payment/payment.component';
import {ReversePipe} from './pipes/reverse.pipe';
import {MakeItNormalTextPipe} from './pipes/make-it-normal-text.pipe';

@NgModule({
    declarations: [
        Tab3Page,
        NoConnetionErroComponent,
        AccessModalComponent,
        GunlistComponent,
        SightlistComponent,
        TermsAndConditionComponent,
        SelectTargetComponent,
        SelectTargetModalComponent,
        ErrorModalComponent,
        ShareDialogComponent,
        ChallengeListComponent,
        PaymentComponent,
        ReversePipe,
        MakeItNormalTextPipe
    ],

    imports: [
        CommonModule,
        MatMenuModule,
        MatExpansionModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    providers: [HitNohitService, ApiService, UserService, StorageService, ScreenOrientation],
    exports: [
        MaterialModule,
        MatMenuModule,
        MatExpansionModule,
        IonicModule,
        FormsModule,
        MakeItNormalTextPipe,
        ReactiveFormsModule,
        Tab3Page, GunlistComponent, SightlistComponent,
        SelectTargetModalComponent,
        ErrorModalComponent, AccessModalComponent, ReversePipe, SelectTargetComponent, TermsAndConditionComponent, PaymentComponent
    ],


})
export class SharedModule {
}




