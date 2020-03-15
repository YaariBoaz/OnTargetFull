import { SinginComponent } from './singin/singin.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: SinginComponent
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AuthRouting { }
