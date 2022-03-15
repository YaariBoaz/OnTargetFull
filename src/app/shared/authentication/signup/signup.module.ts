import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignupComponent} from './signup.component';
import {SharedModule} from '../../shared.module';
import {RouterModule, Routes} from '@angular/router';


export const routes: Routes = [
    {path: '', component: SignupComponent}
];


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),

    ],
    providers: [],
    exports: []
})
export class SignupModule {
}
