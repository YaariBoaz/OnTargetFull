import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared.module';
import {RouterModule, Routes} from '@angular/router';
import {SigninComponent} from './signin.component';

export const routes: Routes = [
    {path: '', component: SigninComponent}
];

@NgModule({
    declarations: [SigninComponent],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [SigninComponent],
    entryComponents: [],
    providers: []
})
export class SigninModule {
}







