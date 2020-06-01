import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignupWizardComponent} from './signup-wizard.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared.module';
import {Tab3PageModule} from '../../../tab3/tab3.module';
import {SignupComponent} from '../signup/signup.component';
import {AppModule} from '../../../app.module';

export const routes: Routes = [
    {path: '', component: SignupWizardComponent}
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
     ],
    declarations: [SignupWizardComponent, SignupComponent],
    exports: [SignupWizardComponent]
})
export class WizardModule {
}


