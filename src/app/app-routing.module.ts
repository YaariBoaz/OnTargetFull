import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './shared/authentication/auth-guard.service';
import {TabsPage} from './tabs/tabs.page';

// const routes: Routes = [
//   { path: '', redirectTo: 'home', pathMatch: 'full' },
//   { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
// ];
const routes: Routes = [
    {
        path: 'signin',
        loadChildren: () => import('./shared/authentication/signin/signin.module').then(m => m.SigninModule),

    },
    {
        path: 'wizard',
        loadChildren: () => import('./shared/authentication/signup-wizard/wizard.module').then(m => m.WizardModule),
    },
    {
        path: 'home',
        component: TabsPage,
        canActivate: [AuthGuardService]

    },
    {path: 'not-found', component: TabsPage, canActivate: [AuthGuardService]},
    {path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {enableTracing: true})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
