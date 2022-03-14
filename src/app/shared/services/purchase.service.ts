import { Injectable } from '@angular/core';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { Platform } from '@ionic/angular';
import { IAPProduct } from '@ionic-native/in-app-purchase-2';
import { Purchases } from '@awesome-cordova-plugins/purchases/ngx';
import { Resolve } from '@angular/router';
import { ApiService } from './api.service';
import { UserService } from './user.service';

const ADL_IAP_KEY = 'adl';
const ADL_IAP_KEY_2_SESSIONS = 'twoSessionSub';
const ADL_IAP_KEY_6_SESSIONS = 'sixSessions';

@Injectable({
    providedIn: 'root'
})
export class PurchaseService {
    products: IAPProduct[];
    product;
    constructor(private purchases: Purchases,
        private plt: Platform,
        private store: InAppPurchase2,
        private srvApi: ApiService) {
        this.plt.ready().then(() => {
            this.purchases.setDebugLogsEnabled(true); // Enable to get debug logs
            this.purchases.setup('appl_zvLCiuPbRXLEBKOylPgsndRSFNX');
            this.purchases.getOfferings().then((offerings) => {
                if (offerings.current !== null) {
                    debugger;
                }
            },
                error => {

                }
            );


            this.store.verbosity = this.store.DEBUG;

            this.registerProducts();
            this.setupListeners();

            // Get the real product information

        });
    }


    setup() {
    }

    getProducts() {
        return new Promise((resolve, reject) => {
            this.store.ready(() => {
                this.products = this.store.products;
                resolve(this.products);
                debugger
            });
        })
    }

    registerProducts() {
        this.store.register({
            id: ADL_IAP_KEY_6_SESSIONS,
            type: this.store.CONSUMABLE,
        });

        this.store.register({
            id: ADL_IAP_KEY_2_SESSIONS,
            type: this.store.CONSUMABLE,
        });

        this.store.register({
            id: ADL_IAP_KEY,
            type: this.store.PAID_SUBSCRIPTION,
        });
        this.store.refresh();
    }

    setupListeners() {
        // General query to all products
        this.store.when('product')
            .approved((p: IAPProduct) => {
                if (p && !p["id"].includes(".onTarget.app")) {
                    console.log("i am in approved event", p);
                    this.srvApi.uploadSubscription(p);
                }
                debugger
            })
            .verified((p: IAPProduct) => {
                console.log("i am in verified event", p);
                p.finish();
            }).cancelled((p) => {
                console.log("i am in cancelled event", p);

            });
    }

    purchase(_product: IAPProduct) {
        const product = Object.assign(_product, {});
        delete product['isSelected'];
        this.store.order(product).then(p => {
            // Purchase in progress!
            console.log("what is purchase", p);
        }, e => {
        });
    }

    // To comply with AppStore rules
    restore() {
        this.store.refresh();
    }



}
