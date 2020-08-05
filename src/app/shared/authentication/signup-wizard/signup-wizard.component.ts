import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {MatHorizontalStepper, MatStepper} from '@angular/material/stepper';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-signup-wizard',
    templateUrl: './signup-wizard.component.html',
    styleUrls: ['./signup-wizard.component.scss'],
})
export class SignupWizardComponent implements OnInit {
    @ViewChild(MatHorizontalStepper, {static: true}) stepper: MatHorizontalStepper;

    isLinear = true;

    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthGroup: FormGroup;

    selectedIndex = 0;
    isInThirdStep = false;
    profile: any;
    private subscription: Subscription;

    constructor(private platform: Platform, private formBuilder: FormBuilder, private router: Router, private ref: ChangeDetectorRef, private zone: NgZone) {
        document.addEventListener('backbutton', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (this.stepper.selectedIndex === 0) {
                this.router.navigateByUrl('');
            } else {
                this.stepper.previous();
            }
            this.ref.detectChanges();
        }, false);
    }


    ngOnInit() {
        this.firstFormGroup = this.formBuilder.group({
            firstCtrl: []
        });
        this.secondFormGroup = this.formBuilder.group({
            secondCtrl: []
        });
        this.thirdFormGroup = this.formBuilder.group({
            thirdCtrl: []
        });

    }


    onSelectionChanged($event: StepperSelectionEvent) {
        this.selectedIndex = $event.selectedIndex;
    }

    onMoveToTargetSearch($event, stepper: MatStepper) {
        this.zone.run(() => {
            stepper.next();
        });
    }

    finishedWizard() {

    }

    onBackToLogin() {
        this.router.navigateByUrl('');
    }


}
