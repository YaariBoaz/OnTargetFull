import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WizardService } from '../authentication/signup-wizard/wizard.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

  constructor(
    private srvWizard: WizardService,
    private modalCtrl: ModalController
  ) {
    this.srvWizard.afterSubscriptionDone.subscribe(() => {
      this.modalCtrl.dismiss();
    });
  }

  ngOnInit() {
  }

  onClose(){
    this.modalCtrl.dismiss();
  }
}
