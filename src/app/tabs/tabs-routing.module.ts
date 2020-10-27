import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Tab1Page} from '../tab1/tab1.page';
import {Tab2Page} from '../tab2/tab2.page';
import {Tab3Page} from '../tab3/tab3.page';
import {DrillComponent} from '../shared/drill/drill.component';

const routes: Routes = [
    {
        path: 'tab2/select',
        component: Tab2Page
    },
    {
        path: 'tab2/select2',
        component: DrillComponent
    },

    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
