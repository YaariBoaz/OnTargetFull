import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './shared/authentication/auth-guard.service';
import {NewTargetDesignComponent} from './shared/components/new-target-design/new-target-design.component';
import {Tab1Page} from './tab1/tab1.page';
import {SelectTargetComponent} from './shared/select-target-modal/select-target-component';
import {ChooseDrillComponent} from './shared/ChooseDrill/choose-drill.component';
import {ChallengeListComponent} from './shared/ChooseDrill/List/challenge-list.component';
import {Tab2Page} from './tab2/tab2.page';

// const routes: Routes = [
//   { path: '', redirectTo: 'home', pathMatch: 'full' },
//   { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
// ];
const routes: Routes = [
    {
        path: 'home',
        component: Tab1Page,

    },
    {
        path: 'select-target',
        component: SelectTargetComponent,

    },
    {
        path: 'choose',
        component: ChallengeListComponent,

    }, {
        path: 'editDrill',
        component: Tab2Page,

    },
    {path: 'new-target', component: NewTargetDesignComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
