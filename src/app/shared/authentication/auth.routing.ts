import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
    {path: '', redirectTo: 'signin', pathMatch: 'full'},
    {

        path: 'wizard',
        loadChildren: () => import('./signup-wizard/wizard.module').then(m => m.WizardModule)
    },
    {
        path: 'signin',
        loadChildren: () => import('./signin/signin.module').then(m => m.SigninModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AuthRouting {
}




