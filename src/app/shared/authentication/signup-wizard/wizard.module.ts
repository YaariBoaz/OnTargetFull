import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignupWizardComponent} from './signup-wizard.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared.module';
import {SignupComponent} from '../signup/signup.component';
import {WizardSummaryComponent} from './wizard-summary/wizard-summary.component';
import {GunlistComponent} from '../../../tab3/gunlist/gunlist.component';
import {SightlistComponent} from '../../../tab3/sightlist/sightlist.component';
import {SelectTargetComponent} from '../../select-target-modal/select-target-component';
import {MatDialogModule} from '@angular/material/dialog';
import {SelectTargetModalComponent} from '../../select-target-modal/modal/select-target-modal.component';
import {PreviewAnyFile} from '@ionic-native/preview-any-file/ngx';
import {File} from '@ionic-native/File/ngx';
import {ErrorModalComponent} from '../../../shared/popups/error-modal/error-modal.component';
import {DocumentViewer} from '@ionic-native/document-viewer/ngx';

export const routes: Routes = [
    {path: '', component: SignupWizardComponent},
    {path: 'gunlist', component: GunlistComponent},
    {path: 'sightlist', component: SightlistComponent},
    {path: 'targetlist', component: SelectTargetComponent},

];


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        MatDialogModule,
    ],
    declarations: [
        SignupWizardComponent,
        SignupComponent,
        WizardSummaryComponent,
    ],
    providers: [PreviewAnyFile, File, DocumentViewer],
    entryComponents: [SelectTargetModalComponent, ErrorModalComponent],

    exports: [SignupWizardComponent]
})
export class WizardModule {
}




