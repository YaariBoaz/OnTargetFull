import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './shared/authentication/auth-guard.service';

// const routes: Routes = [
//   { path: '', redirectTo: 'home', pathMatch: 'full' },
//   { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
// ];
const routes: Routes = [
    {
        path: 'wizard',
        loadChildren: () => import('./shared/authentication/signup-wizard/wizard.module').then(m => m.WizardModule),
    },
    {
        path: 'home',
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),

    },
    {
        path: '',
        loadChildren: () => import('./shared/authentication/signin/signin.module').then(m => m.SigninModule),

    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}




