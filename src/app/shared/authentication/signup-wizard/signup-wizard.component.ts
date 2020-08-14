import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {MatHorizontalStepper, MatStepper} from '@angular/material/stepper';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {WizardService} from './wizard.service';

@Component({
    selector: 'app-signup-wizard',
    templateUrl: './signup-wizard.component.html',
    styleUrls: ['./signup-wizard.component.scss'],
})
export class SignupWizardComponent implements OnInit {
    @ViewChild(MatHorizontalStepper, {static: true}) stepper: MatHorizontalStepper;

    public stepOneComplete: boolean;
    public stepTwoComplete: boolean;
    public stepThreeComplete: boolean;

    public stepOneActive: boolean;
    public stepTwoActive: boolean;
    public stepThreeActive: boolean;
    public stepFourActive: boolean;

    isLinear = true;

    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthGroup: FormGroup;

    selectedIndex = 0;
    isInThirdStep = false;
    profile: any;
    private subscription: Subscription;
    sigunUpFormDetails: any;


    constructor(private platform: Platform,
                private formBuilder: FormBuilder,
                private router: Router,
                private ref: ChangeDetectorRef,
                private zone: NgZone,
                private wizardService: WizardService) {
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
        if (this.wizardService.isFromListScreen) {

        }
        this.stepOneActive = true;

        // this.stepThreeActive = true;
        // this.stepTwoComplete = true;
        // this.stepOneComplete = true;

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


    activeNextStep() {
        this.stepOneComplete = true;
        this.stepTwoActive = true;
    }

    backToFirst() {
        this.stepThreeComplete = false;
        this.stepThreeActive = false;

        this.stepTwoComplete = false;
        this.stepTwoActive = false;

        this.stepOneActive = true;
        this.stepOneComplete = false;

    }

    completeStepTwo(f) {
        this.sigunUpFormDetails = {
            email: f.email,
            first_name: f.first_name,
            img_path: null,
            last_name: f.last_name,
            password: f.password
        };

        this.stepTwoComplete = true;
        this.stepThreeActive = true;
    }

    completeStepThree() {
        this.stepThreeComplete = true;
        this.stepFourActive = true;
    }
}
