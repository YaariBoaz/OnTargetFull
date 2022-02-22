import {Injectable} from '@angular/core';
import {InAppPurchase2} from '@ionic-native/in-app-purchase-2/ngx';
import {Platform} from '@ionic/angular';
import {IAPProduct} from '@ionic-native/in-app-purchase-2';

const ADL_IAP_KEY = 'adl';

@Injectable({
    providedIn: 'root'
})
export class PurchaseService {
    products: IAPProduct[];

    constructor(private store: InAppPurchase2, private plt: Platform) {
        this.plt.ready().then(() => {
            this.store.verbosity = this.store.DEBUG;
        });
        this.registerProducts();
        this.setupListeners();
        this.store.ready(() => {
            this.products = this.store.products;
        });
    }

    registerProducts() {
        this.store.register({id: ADL_IAP_KEY, type: this.store.PAID_SUBSCRIPTION});
        this.store.refresh();
    }

    setupListeners() {
        this.store.when('product').approved((p: IAPProduct) => {
            if (p.id === ADL_IAP_KEY) {

            }
            return p.verify();
        }).verified((p: IAPProduct) => p.finish());
        this.store.when(ADL_IAP_KEY).owned((p: IAPProduct) => {

        });
    }

    purchase(product: IAPProduct) {
        this.store.order(product).then(p => {

        }, e => {
            console.error('FAILD - FAILED TO PURCHASE:' + e);
        });
    }
}
