import { Injectable } from '@angular/core';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { Platform } from '@ionic/angular';
import { IAPProduct } from '@ionic-native/in-app-purchase-2';
import { Purchases } from '@awesome-cordova-plugins/purchases/ngx';
import { Resolve } from '@angular/router';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { Subject } from 'rxjs';

const ADL_IAP_KEY = 'autoRenew';
const ADL_IAP_KEY_2_SESSIONS = 'twoSessionSub';
const ADL_IAP_KEY_6_SESSIONS = 'sixSessions';


const ADL_IAP_KEY_md = 'adl_montly';
const ADL_IAP_KEY_2_SESSIONS_md = 'two_session_sub';
const ADL_IAP_KEY_6_SESSIONS_md = 'six_sessions';


@Injectable({
    providedIn: 'root'
})
export class PurchaseService {
    products: IAPProduct[];
    product;
    $notifyPurchaseApproved = new Subject();
    constructor(private purchases: Purchases,
        private plt: Platform,
        public store: InAppPurchase2,
        private srvApi: ApiService) {
        this.plt.ready().then(() => {
            this.purchases.setDebugLogsEnabled(true); // Enable to get debug logs
            this.purchases.setup('appl_zvLCiuPbRXLEBKOylPgsndRSFNX');
            this.purchases.getOfferings().then((offerings) => {
                if (offerings.current !== null) {
                    ;
                }
            },
                error => {

                }
            );


            this.store.verbosity = this.store.DEBUG;

            this.registerProducts();


            // Get the real product information

        });
    }


    setup() {
    }

    getProducts() {
        return new Promise((resolve, reject) => {
            this.store.ready(() => {
                this.products = this.store.products;
                console.log("this.products", JSON.stringify(this.products));
                resolve(this.products);
            });
        });
    }

    registerProducts() {
        if (this.plt.is('ios')) {
            this.store.register({
                id: ADL_IAP_KEY_6_SESSIONS,
                type: this.store.NON_CONSUMABLE,
            });

            this.store.register({
                id: ADL_IAP_KEY_2_SESSIONS,
                type: this.store.NON_CONSUMABLE,
            });

            this.store.register({
                id: ADL_IAP_KEY,
                type: this.store.NON_CONSUMABLE,
            });
        } else {
            this.store.register({
                id: ADL_IAP_KEY_md,
                type: this.store.NON_CONSUMABLE,
            });

            this.store.register({
                id: ADL_IAP_KEY_6_SESSIONS_md,
                type: this.store.CONSUMABLE,
            });

            this.store.register({
                id: ADL_IAP_KEY_2_SESSIONS_md,
                type: this.store.CONSUMABLE,
            });

        }


        // Register event handlers for the specific product
        // this.store.when('product').registered((product: IAPProduct) => {
        //     console.log('Registered: ADL_IAP_KEY_md ' + JSON.stringify(product));
        // });

        // Track all store errors
        this.store.error((err) => {
            console.error('Store Error ' + JSON.stringify(err));
        });

        // Run some code only when the store is ready to be used
        this.store.ready(() => {
            console.log('Store is ready');
            console.log('Products: ' + JSON.stringify(this.store.products));
            console.log(JSON.stringify(this.store.get("my_product_id")));
        });


        this.store.refresh();
        this.setupListeners();
        // this.getProducts();
    }

    setupListeners() {
        // General query to all products
        this.store.when('product')
            .approved((p: IAPProduct) => {
                if (p && !p.id.includes('.onTarget.app')) {
                    // console.log('i am in approved event', p);
                    this.srvApi.uploadSubscription(p);
                    this.$notifyPurchaseApproved.next(true);
                }
            })
            .verified((p: IAPProduct) => {
                // console.log('i am in verified event', p);
                p.finish();
            }).cancelled((p) => {
                console.log('i am in cancelled event', p);

            });
    }

    purchase(_product: IAPProduct) {
        const product = Object.assign(_product, {});
        // @ts-ignore
        delete product.isSelected;
        this.store.order(product).then(p => {
            // Purchase in progress!
            console.log('what is purchase', p);
        }, e => {
        });
    }

    // // To comply with AppStore rules
    // restore() {
    //     this.store.refresh();
    // }



}
