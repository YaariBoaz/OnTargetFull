import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from '../../tabs/tabs.page';


const routes: Routes = [
    {path: '', redirectTo: 'signin'},
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




