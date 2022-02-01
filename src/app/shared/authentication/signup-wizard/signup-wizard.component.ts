import {ChangeDetectorRef, Component, EventEmitter, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
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
import {DocumentViewer} from '@ionic-native/document-viewer/ngx';
import {DocumentViewerOptions} from '@ionic-native/document-viewer';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';

@Component({
    selector: 'app-signup-wizard',
    templateUrl: './signup-wizard.component.html',
    styleUrls: ['./signup-wizard.component.scss'],
})
export class SignupWizardComponent implements OnInit {
    @ViewChild(MatHorizontalStepper, {static: true}) stepper: MatHorizontalStepper;
    @Output() closWizard = new EventEmitter();
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
    isShowUOT = false;
    isPrivatePolicy = false;

    constructor(private platform: Platform,
                private formBuilder: FormBuilder,
                private router: Router,
                private nativePageTransitions: NativePageTransitions,
                private ref: ChangeDetectorRef,
                private zone: NgZone,
                private file: File,
                private http: HttpClient,
                private documentV: DocumentViewer,
                private previewAnyFile: PreviewAnyFile,
                private wizardService: WizardService) {

        this.platform.backButton.subscribeWithPriority(10, () => {
            this.closWizard.emit();
        });

        document.addEventListener('ionBackButton', (ev: any) => {
            this.closWizard.emit();
        });


        const content: any = document.querySelector('mat-tab-header');
        if (content) {
            content.style.display = 'none';
        }


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

    ionViewWillLeave() {

        const options: NativeTransitionOptions = {
            direction: 'up',
            duration: 500,
            slowdownfactor: 3,
            slidePixels: 20,
            iosdelay: 100,
            androiddelay: 150,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 60
        };

        this.nativePageTransitions.slide(options)
            .then(() => {
            })
            .catch(() => {
            });

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
        const os = this.getMobileOperatingSystem();
        if (os === 'iOS') {
            const baseUrl = location.href.replace('/index.html', '');
            this.documentV.viewDocument(baseUrl + '/assets/docs/ADLTOU.pdf', 'application/pdf', {title: 'Terms Of Use'});

        } else {
            const options: DocumentViewerOptions = {
                title: 'Terms Of Use'
            };
            this.documentV.viewDocument('file:///android_asset/www/assets/docs/ADLTOU.pdf', 'application/pdf', options);
        }


    }

    openPrivacy() {
        const os = this.getMobileOperatingSystem();
        if (os === 'iOS') {
            const baseUrl = location.href.replace('/index.html', '');
            this.documentV.viewDocument(baseUrl + '/assets/docs/ADLPrivacyPolicy.pdf', 'application/pdf', {title: 'Terms Of Use'});

        } else {
            const options: DocumentViewerOptions = {
                title: 'Privacy Policy'
            };
            this.documentV.viewDocument('file:///android_asset/www/assets/docs/ADLPrivacyPolicy.pdf', 'application/pdf', options);
        }
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

    finishWizardNew() {
        this.wizardService.registerUser();
    }

    activeNextStep() {
        this.stepOneComplete = true;
        this.stepOneActive = false;
        this.stepTwoActive = true;
    }

    backToFirst() {
        this.closWizard.emit();
    }

    completeStepTwo(f) {
        this.sigunUpFormDetails = {
            email: f.value.email,
            first_name: f.value.first_name,
            img_path: null,
            last_name: f.value.last_name,
            password: f.value.password
        };

        this.stepOneComplete = true;
        this.stepTwoComplete = false;
        this.stepTwoActive = true;
        this.ref.detectChanges();
    }

    completeStepThree() {
        this.stepThreeComplete = true;
        this.stepThreeActive = false;
        this.stepFourActive = true;
    }


    getMobileOperatingSystem() {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return 'Windows Phone';
        }

        if (/android/i.test(userAgent)) {
            return 'Android';
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
            return 'iOS';
        }

        return 'unknown';
    }

    back() {
        if (this.stepOneActive) {
            this.router.navigateByUrl('');
        }
        if (this.stepTwoActive) {
            this.backToFirst();
        }
        if (this.stepThreeActive) {
            this.stepTwoActive = true;
            this.stepThreeActive = false;
        }
        if (this.stepFourActive) {
            this.stepThreeActive = true;
            this.stepFourActive = false;
        }
    }
}
