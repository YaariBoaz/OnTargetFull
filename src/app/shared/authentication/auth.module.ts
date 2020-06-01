import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {WizardModule} from './signup-wizard/wizard.module';
import {AuthRouting} from './auth.routing';



@NgModule({
    declarations: [],
    imports: [SharedModule, WizardModule, AuthRouting],
    providers: [],
    exports: [],
    entryComponents: []
})

export class AuthModule {
}

// StorageService, Facebook, StorageService, Camera, Crop, File]
