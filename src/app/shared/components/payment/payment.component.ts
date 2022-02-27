import {Component, OnInit} from '@angular/core';
import {PurchaseService} from '../../services/purchase.service';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {

    products;
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

    constructor(private purchaseService:PurchaseService) {
    }

    ngOnInit() {
      //  this.products = this.purchaseService.getProducts();
        console.log(this.products);
    }
    
    

    selectedAndReload(item) {
        this.prices.forEach(x => x.isSelected = false);
        item.isSelected = true;
    }
}
