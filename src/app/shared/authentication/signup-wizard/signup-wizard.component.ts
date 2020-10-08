import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {MatHorizontalStepper, MatStepper} from '@angular/material/stepper';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {WizardService} from './wizard.service';
import {PreviewAnyFile} from '@ionic-native/preview-any-file/ngx';
import {HttpClient} from '@angular/common/http';
import {File} from '@ionic-native/File/ngx';

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
    isTargetModalOpned = false;
    assetPath1 = './assets//docs/ADLTOU.doc';
    assetPath2 = './assets//docs/ADLPrivacyPolicy.doc';

    constructor(private platform: Platform,
                private formBuilder: FormBuilder,
                private router: Router,
                private ref: ChangeDetectorRef,
                private zone: NgZone,
                private file: File,
                private http: HttpClient,
                private previewAnyFile: PreviewAnyFile,
                private wizardService: WizardService) {

        this.wizardService.selectTargetFromWizardOpened.subscribe(flag => {
            this.isTargetModalOpned = flag;
        });


        document.addEventListener('backbutton', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (this.isTargetModalOpned) {
                this.isTargetModalOpned = false;
            } else {
                if (!this.stepOneComplete) {
                    this.router.navigateByUrl('');
                } else if (this.stepOneComplete && !this.stepTwoComplete) {
                    this.stepOneComplete = false;
                } else if (this.stepTwoComplete) {
                    this.stepTwoComplete = false;
                }
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

    openTerms() {
        this.http.get(this.assetPath1, {responseType: 'blob'}).subscribe(fileBlob => {
            let fileName = this.assetPath1.replace(/^.*(\\|\/|\:)/, '');
            const writeDirectory = this.platform.is('ios') ? this.file.syncedDataDirectory : this.file.externalDataDirectory;
            this.file.writeFile(writeDirectory, fileName, fileBlob, {replace: true}).then(fileProp => {
                this.previewAnyFile.preview(fileProp.nativeURL);
            })
        });
    }

    openPrivacy() {
        this.http.get(this.assetPath2, {responseType: 'blob'}).subscribe(fileBlob => {
            let fileName = this.assetPath2.replace(/^.*(\\|\/|\:)/, '');
            const writeDirectory = this.platform.is('ios') ? this.file.syncedDataDirectory : this.file.externalDataDirectory;
            this.file.writeFile(writeDirectory, fileName, fileBlob, {replace: true}).then(fileProp => {
                this.previewAnyFile.preview(fileProp.nativeURL);
            })
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
            email: f.value.email,
            first_name: f.value.first_name,
            img_path: null,
            last_name: f.value.last_name,
            password: f.value.password
        };

        this.stepTwoComplete = true;
        this.stepThreeActive = true;
        this.ref.detectChanges();
    }

    completeStepThree() {
        this.stepThreeComplete = true;
        this.stepFourActive = true;
    }
}
