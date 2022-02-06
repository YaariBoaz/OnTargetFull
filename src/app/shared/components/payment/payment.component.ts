import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {


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

    constructor() {
    }

    ngOnInit() {
    }

    selectedAndReload(item) {
        this.prices.forEach(x => x.isSelected = false);
        item.isSelected = true;
    }
}
