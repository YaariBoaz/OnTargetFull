import {Component, NgZone} from '@angular/core';
import {TabsService} from './tabs.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Platform} from '@ionic/angular';


@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],

})
export class TabsPage {
    splash = true;
    tabBarElement: any;
    private subscription: Subscription;
    currentTab = 'tab1';

    constructor(private tabService: TabsService, private router: Router, private zone: NgZone, private platform: Platform) {
        this.tabBarElement = document.querySelector('.tabbar');
    }

    ionViewDidEnter() {
        this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {

        });
    }

    ionViewWillLeave() {
        this.subscription.unsubscribe();
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
        if (url.indexOf('tab3') > -1) {
            return 'tab3';
        } else if (url.indexOf('tab2') > -1) {
            return 'tab2';
        } else {
            return 'tab1';
        }
    }
}
