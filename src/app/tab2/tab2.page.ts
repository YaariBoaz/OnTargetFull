import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalController, Platform} from '@ionic/angular';
import {AlertController} from '@ionic/angular';
import {ShootingService} from '../shared/services/shooting.service';
import {StorageService} from '../shared/services/storage.service';
import {TabsService} from '../tabs/tabs.service';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

    @ViewChild('slides', {static: false}) slides;

    s;
    mySights;
    myGuns;
    drill: DrillObject = {
        numOfBullets: 5,
        weapon: 'Bergara HMR Pro',
        range: 150,
        rangeUOM: 'Meters',
        sight: 'V6 5-30 X 50',
        ammo: 'Creedmor 6.5',
        drillType: 'Hit/No Hit',
        shots: new Array<{ x, y }>()
    };


    constructor(public modalController: ModalController,
                private tabService: TabsService,
                public alertController: AlertController,
                private  shootingService: ShootingService,
                private storageService: StorageService,
                private platform: Platform) {
        this.initComponents();
    }

    ngOnInit(): void {
        this.tabService.$notifyTab2.subscribe(() => {
            this.initComponents();
        });
    }

    initComponents() {
        this.mySights = this.storageService.getItem('sightList');
        this.myGuns = this.storageService.getItem('gunList');
        this.setSightsAndWeapons();
    }


    slideDidChange(event) {
        this.slides.getActiveIndex().then(index => {
            switch (index) {
                case 0:
                    this.drill.drillType = 'Hit/No Hit';
                    break;
                case 1:
                    this.drill.drillType = 'Bullseye';
                    break;
                case 1:
                    this.drill.drillType = 'Zero';
                    break;
                case 2:
                    this.drill.drillType = 'Hostage';
                    break;
            }

        });
    }


    startSesstion() {
        this.shootingService.selectedDrill = this.drill;
        this.shootingService.numberOfBullersPerDrill = this.drill.numOfBullets;
    }

    async showLongRangeAlert() {
        const alert = await this.alertController.create({
            header: 'Wifi Error',
            subHeader: 'Wifi not connected to gateway',
            message: 'Please connect to long-range-target',
            buttons: ['OK']
        });

        await alert.present();
    }


    private setSightsAndWeapons() {
        if (this.myGuns) {
            this.drill.weapon = this.myGuns[1];
        } else {
            this.myGuns = this.storageService.DEFAULT_WEAPONS;
            this.drill.weapon = this.myGuns[1];
        }

        if (this.mySights) {
            this.drill.sight = this.mySights[0];
        } else {
            this.mySights = this.storageService.DEFAULT_SIGHTS;
            this.drill.sight = this.mySights[0];
        }
    }


}

export interface DrillObject {
    numOfBullets: number;
    weapon: string;
    range: number;
    rangeUOM: string;
    sight: string;
    ammo: string;
    drillType: string;
    shots: Array<{ x: number, y: number }>;
}
