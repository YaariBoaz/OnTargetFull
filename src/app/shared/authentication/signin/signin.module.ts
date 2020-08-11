import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared.module';
import {RouterModule, Routes} from '@angular/router';
import {SigninComponent} from './signin.component';
import {ErrorModalComponent} from '../../popups/error-modal/error-modal.component';
import {AccessModalComponent} from '../../popups/access-modal/access-modal.component';

export const routes: Routes = [
    {path: '', component: SigninComponent}
];

@NgModule({
    declarations: [SigninComponent, ErrorModalComponent, AccessModalComponent],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [SigninComponent],
    entryComponents: [ErrorModalComponent, AccessModalComponent],
    providers: []
})
export class SigninModule {
}







