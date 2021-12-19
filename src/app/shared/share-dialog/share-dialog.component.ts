import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DrillType} from '../../tab2/tab2.page';
import {ModalController} from '@ionic/angular';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import domtoimage from 'dom-to-image';
import html2canvas from 'html2canvas';
import {saveAsPng, saveAsJpeg} from 'save-html-as-image';
import {tap} from 'rxjs/operators';
import {NgxCaptureService} from 'ngx-capture';

// tslint:disable-next-line:label-position

@Component({
    selector: 'app-share-dialog',
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.scss'],
})
export class ShareDialogComponent implements OnInit {
    @ViewChild('shareDiv') shareDiv: ElementRef;
    @ViewChild('canvas') canvas: ElementRef;
    @ViewChild('downloadLink') downloadLink: ElementRef;
    train;
    loader: any = null;
    sharingText = 'You can download our app from playstore or use this link to download the app. And you can share awesome coupons with your loved once, Thank you';
    emailSubject = 'Download Apps';
    recipent = ['recipient@example.org'];
    environment = {
        production: false,
        socialShareOption: [
            {
                title: 'Whatsapp',
                logo: 'assets/social/whatsapp.png',
                shareType: 'shareViaWhatsApp'
            },
            {
                title: 'Facebook',
                logo: 'assets/social/fb.png',
                shareType: 'shareViaFacebook'
            },
            {
                title: 'Twitter',
                logo: 'assets/social/twitter.png',
                shareType: 'shareViaTwitter'
            },
            {
                title: 'Instagram',
                logo: 'assets/social/instagram.png',
                shareType: 'shareViaInstagram'
            },
            {
                title: 'Email',
                logo: 'assets/social/email.png',
                shareType: 'viaEmail'
            }
        ],
    };
    public sharingList = this.environment.socialShareOption;

    public get drillTypeEnum(): typeof DrillType {
        return DrillType;
    }

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private modal: ModalController,
                private socialSharing: SocialSharing,
                private captureService: NgxCaptureService) {
        this.train = data.drill;
        console.log(this.train);
    }

    ngOnInit() {
    }

    shareVia() {
        this.captureService.getImage(this.shareDiv.nativeElement, true)
            .pipe(
                tap((img: string) => {
                    debugger
                    this.socialSharing.shareViaFacebook('Check out my freaking crazy score shooting', img).then(() => {
                        debugger;
                    });
                })
            ).subscribe();

    }

    shareViaEmail() {
        this.socialSharing.canShareViaEmail().then((res) => {
            this.socialSharing.shareViaEmail(this.sharingText, this.emailSubject, this.recipent, null, null).then(() => {
                this.modal.dismiss();
            });
        }).catch((e) => {
            // Error!
        });
    }

}

