import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {InitService} from './shared/services/init.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private initService: InitService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.initService.trySyncData();
        });
    }
}
