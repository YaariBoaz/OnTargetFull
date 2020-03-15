import {Component} from '@angular/core';
import {TabsService} from './tabs.service';
import {Router} from '@angular/router';


@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],

})
export class TabsPage {
    splash = true;
    tabBarElement: any;

    constructor(private tabService: TabsService, private router: Router) {
        this.tabBarElement = document.querySelector('.tabbar');
    }

    ionViewDidLoad() {
        this.tabBarElement.style.display = 'none';
        setTimeout(() => {
            this.splash = false;
            this.tabBarElement.style.display = 'flex';
        }, 4000);
    }


    ionTabsWillChange($event) {
        switch ($event.tab) {
            case 'tab1':
                this.tabService.notifyTab1();
                break;
            case 'tab2':
                this.tabService.notifyTab2();
                break;
            case 'tab3':
                this.tabService.notifyTab3();
        }
    }

    isRout() {
        const url = this.router.url;
        if (url.indexOf('tab1') > -1) {
            return 'tab1';
        } else if (url.indexOf('tab2') > -1) {
            return 'tab2';
        } else {
            return 'tab3';
        }
    }
}
