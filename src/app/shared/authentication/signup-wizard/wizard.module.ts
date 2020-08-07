import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignupWizardComponent} from './signup-wizard.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared.module';
import {SignupComponent} from '../signup/signup.component';
import {WizardSummaryComponent} from './wizard-summary/wizard-summary.component';

export const routes: Routes = [
    {path: '', component: SignupWizardComponent}
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
    ],
    declarations: [SignupWizardComponent, SignupComponent, WizardSummaryComponent],
    exports: [SignupWizardComponent]
})
export class WizardModule {
}


