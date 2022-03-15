import {Component,EventEmitter, OnInit, Output} from '@angular/core';
import { IAPProduct } from '@ionic-native/in-app-purchase-2';
import { PurchaseService } from '../../services/purchase.service';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
    @Output() exit = new EventEmitter();
    products: IAPProduct[];
    prices = [
        {
            timeLimit: 'ONE TIME USE',
            price: 3,
            pricePer: 'session',
            sessionForFree: 'Two session for free',
            isPopular: false,
            isSelected: false
        },
        {
            timeLimit: 'ONE TIME USE',
            price: 3,
            pricePer: 'session',
            sessionForFree: 'Two session for free',
            isPopular: false,
            isSelected: false
        }, {
            timeLimit: 'NO LIMIT',
            price: 16.99,
            pricePer: 'month',
            sessionForFree: 'Unlimited session!',
            isPopular: true,
            isSelected: true
        }
    ];

    constructor(private purchaseService: PurchaseService) {
    }

    ngOnInit() {
        this.purchaseService.getProducts().then((products: IAPProduct[]) => {
            // this.products = products;
            this.products = products.filter((pro) => { return pro.price != null });
            this.products.forEach(x => x['isSelected'] = false);
            this.products[0]['isSelected'] = true;
            console.log("products =>", products);
        });

        this.purchaseService.$notifyPurchaseApproved.subscribe(data =>{
            if(data){
                this.exit.emit(true);
            }
        })
    }


    onPurchase() {
        this.purchaseService.purchase(this.products.find((pro) => { return pro['isSelected'] }));
        // console.log(this.purchaseService.products);
    }

    selectedAndReload(item) {
        this.products.forEach(x => x['isSelected'] = false);
        item.isSelected = true;
    }
}
