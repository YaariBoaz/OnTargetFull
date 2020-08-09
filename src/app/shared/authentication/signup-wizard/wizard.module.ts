import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignupWizardComponent} from './signup-wizard.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared.module';
import {SignupComponent} from '../signup/signup.component';
import {WizardSummaryComponent} from './wizard-summary/wizard-summary.component';
import {GunlistComponent} from '../../../tab3/gunlist/gunlist.component';
import {SightlistComponent} from '../../../tab3/sightlist/sightlist.component';
import {SelectTargetModalComponent} from '../../select-target-modal/select-target-modal.component';

export const routes: Routes = [
    {path: '', component: SignupWizardComponent},
    {path: 'gunlist', component: GunlistComponent},
    {path: 'sightlist', component: SightlistComponent},
    {path: 'targetlist', component: SelectTargetModalComponent},

];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        SignupWizardComponent,
        SignupComponent,
        WizardSummaryComponent],

    exports: [SignupWizardComponent]
})
export class WizardModule {
}


