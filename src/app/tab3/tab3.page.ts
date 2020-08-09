import {Component, OnInit, NgZone, ChangeDetectorRef, Input, Output, EventEmitter} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {StorageService} from '../shared/services/storage.service';
import {Camera, CameraOptions} from '@ionic-native/Camera/ngx';
import {File} from '@ionic-native/file/ngx';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {Crop} from '@ionic-native/crop/ngx';
import {Base64} from '@ionic-native/base64/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import {Tab3Service} from './tab3.service';
import {InventoryModel} from '../shared/models/InventoryModel';
import {ProfileImageService} from '../shared/services/profile-image.service';
import {WizardService} from '../shared/authentication/signup-wizard/wizard.service';
import {MatDialog} from '@angular/material';
import {GunlistComponent} from './gunlist/gunlist.component';
import {SightlistComponent} from './sightlist/sightlist.component';
import {SelectTargetModalComponent} from '../shared/select-target-modal/select-target-modal.component';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
    @Output() move: EventEmitter<any> = new EventEmitter<any>();
    @Output() stepThreeComplete: EventEmitter<any> = new EventEmitter<any>();
    croppedImagepath;
    profile;
    images;
    index = 0;
    ip: any;
    isGunList = false;
    isSightList = false;

    myGuns = null;
    mySights = null;
    myTarget = null;
    isEditMode = false;
    selectTarget = false;
    showHeader = false;
    isFromWizard: boolean;

    constructor(private storageService: StorageService,
                private ref: ChangeDetectorRef,
                private crop: Crop,
                private router: Router,
                private alertCtrl: AlertController,
                private tab3Service: Tab3Service,
                public domSanitizer: DomSanitizer,
                private profileImageService: ProfileImageService,
                private wizardService: WizardService,
                public dialog: MatDialog
    ) {
        if (this.router.url === '/home/tabs/tab3') {
            this.showHeader = true;
        } else {
            this.isFromWizard = true;
        }
    }

    ionViewDidEnter() {
        this.initActctions();
    }

    initActctions() {

        this.profile = this.storageService.getItem('profileData');
        const inventory: InventoryModel = this.storageService.getItem('inventory');
        const target = this.storageService.getItem('personalTarget');
        if (!inventory) {
            this.myGuns = null;
            this.mySights = null;
        } else {
            this.myGuns = inventory.wepons;
            this.mySights = inventory.sight;
        }
        if (target) {
            this.myTarget = target;
        }
        if (!this.profile) {
            this.profile = {};
        }

        this.tab3Service.passProfileFromRegister.subscribe(profile => {
            if (profile) {
                this.profile = profile;
            }
        });

        // Remove this
        this.profile.email = 'evi@adl.solutions';
        this.profile.age = 35;
    }

    ngOnInit(): void {
        this.initActctions();
    }

    onSelectWeapons() {
        const dialogRef = this.dialog.open(GunlistComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'dialog-bg'
        });

        dialogRef.afterClosed().subscribe(result => {
            this.myGuns = this.storageService.getItem('inventory').wepons;
        });
    }

    onSelectSights() {
        const dialogRef = this.dialog.open(SightlistComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'dialog-bg'
        });

        dialogRef.afterClosed().subscribe(result => {
            this.mySights = this.storageService.getItem('inventory').sight;
        });
    }

    onSaveProfile() {
        this.isEditMode = false;
        this.storageService.setItem('profileData', this.profile);
    }

    async onSelectTarget() {
        const dialogRef = this.dialog.open(SelectTargetModalComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: {
                isFromWizard: true
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.myTarget = this.storageService.getItem('personalTarget');
        });
    }

    selectImage() {
        const image = this.profileImageService.selectImage();
        // this.registerForm.value.img_path = this.profileImageService.selectImage();
        this.ref.detectChanges();
    }


    finishWizard() {
        this.wizardService.registerUser();
        this.move.emit();
    }

    onHideTargets() {
        this.selectTarget = false;
        this.myTarget = this.storageService.getItem('target');

    }
}

