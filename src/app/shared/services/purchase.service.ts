import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';

const ADL_IAP_KEY = 'adl';
const ADL_IAP_KEY_2_SESSIONS = 'twoSessionSub';
const ADL_IAP_KEY_6_SESSIONS = 'sixSessions';

@Injectable({
    providedIn: 'root'
})
export class PurchaseService {
    product;

    constructor() {
        // this.plt.ready().then(() => {
        //     this.purchases.setDebugLogsEnabled(true); // Enable to get debug logs
        //     this.purchases.setup('appl_zvLCiuPbRXLEBKOylPgsndRSFNX');
        //     this.purchases.getOfferings().then((offerings) => {
        //             if (offerings.current !== null) {
        //                 debugger;
        //             }
        //         },
        //         error => {
        //
        //         }
        //     );
        //
        //
        //     this.store.verbosity = this.store.DEBUG;
        //
        //     this.registerProducts();
        //     this.setupListeners();
        //
        //     // Get the real product information
        //     this.store.ready(() => {
        //         this.products = this.store.products;
        //         debugger
        //      });
        // });
    }


    setup() {


    }

    registerProducts() {
        // this.store.register({
        //     id: ADL_IAP_KEY_6_SESSIONS,
        //     type: this.store.CONSUMABLE,
        // });
        //
        // this.store.register({
        //     id: ADL_IAP_KEY_2_SESSIONS,
        //     type: this.store.CONSUMABLE,
        // });
        //
        // this.store.register({
        //     id: ADL_IAP_KEY,
        //     type: this.store.PAID_SUBSCRIPTION,
        // });
        // this.store.refresh();
    }

    setupListeners() {
        // General query to all products
        // this.store.when('product')
        //     .approved((p: IAPProduct) => {
        //       debugger
        //     })
        //     .verified((p: IAPProduct) => p.finish());


    }

    purchase() {
        // this.store.order(product).then(p => {
        //     // Purchase in progress!
        // }, e => {
        //  });
    }

    // To comply with AppStore rules
    restore() {
        // this.store.refresh();
    }


}
