import {Component, OnInit} from '@angular/core';
import {WizardService} from '../wizard.service';
import {bounceInDown, bounceInLeft, bounceInRight, bounceInUp, zoomIn} from 'ngx-animate/lib';
import {transition, trigger, useAnimation} from '@angular/animations';
import {Router} from '@angular/router';

@Component({
    selector: 'app-wizard-summary',
    templateUrl: './wizard-summary.component.html',
    styleUrls: ['./wizard-summary.component.scss'],
    animations: [
        trigger('zoomIn1', [transition('* => *', useAnimation(zoomIn, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {timing: 6}
        }))]),
        trigger('zoomIn2', [transition('* => *', useAnimation(zoomIn, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {timing: 7}
        }))]),
        trigger('zoomIn3', [transition('* => *', useAnimation(zoomIn, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {timing: 8}
        }))]),
        trigger('zoomIn4', [transition('* => *', useAnimation(zoomIn, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {timing: 9}
        }))]),

        trigger('zoomIn5', [transition('* => *', useAnimation(zoomIn, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {timing: 10}
        }))]),
        trigger('bounceInUp', [transition('* => *', useAnimation(bounceInUp, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {deley: 4, timing: 6}
        }))]),
        trigger('bounceInRight', [transition('* => *', useAnimation(bounceInRight, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {deley: 2, timing: 2}
        }))]),
        trigger('bounceInLeft', [transition('* => *', useAnimation(bounceInLeft, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {deley: 3, timing: 4}
        }))]),
        trigger('bounceInUp', [transition('* => *', useAnimation(bounceInUp, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {deley: 4, timing: 6}
        }))]),
        trigger('bounceInDown', [transition('* => *', useAnimation(bounceInDown, {
            // Set the duration to 5seconds and delay to 2seconds
            params: {deley: 5, timing: 8}
        }))])
    ],
})
export class WizardSummaryComponent implements OnInit {

    addUserComplete = false;
    addUserStart = false;

    addWeaponComplete = false;
    addWeaponStart = false;

    addScopeComplete = false;
    addScopeStart = false;

    addTargetComplete = false;
    addTargetStart = false;

    allIsComplete = false;


    constructor(private  wizardService: WizardService, private router: Router) {
    }

    ngOnInit() {
        this.wizardService.notifyWizardSummaryStart.subscribe(data => {
            if (data) {
                this.addUserStart = true;
            }
        });
        this.wizardService.notifyUserWasRegisterd.subscribe(data => {
            if (data) {
                setTimeout(() => {
                    this.addUserStart = false;
                    this.addUserComplete = true;
                    this.addWeaponStart = true;

                }, 1000);
            }
        });

        this.wizardService.notifyWeaponWasSet.subscribe(data => {
            if (data) {
                setTimeout(() => {
                    this.addWeaponStart = false;
                    console.log('Change addWeaponStart TO FALSE');
                    this.addWeaponComplete = true;
                    this.addScopeStart = true;
                }, 2000);
            }
        });

        this.wizardService.notifyScopeWasSet.subscribe(data => {
            if (data) {
                setTimeout(() => {
                    this.addScopeStart = false;
                    this.addScopeComplete = true;
                }, 3000);
            }
        });


        this.wizardService.notifyTargetAssigned.subscribe(data => {
            if (data) {
                setTimeout(() => {
                    this.addTargetStart = false;
                    this.addTargetComplete = true;
                    this.router.navigateByUrl('/home/tabs/tab1');
                }, 3000);
            }
        });
    }


    getColor(stage: number) {
        switch (stage) {
            case 1:
                if (this.addUserStart) {
                    return 'orange';
                } else if (this.addUserComplete) {
                    return 'green';
                } else {
                    return 'gray';
                }
            case 2:
                if (this.addWeaponComplete) {
                    return 'green';
                } else if (this.addWeaponStart) {
                    return 'orange';
                } else {
                    return 'gray';
                }
            case 3:
                if (this.addScopeComplete) {
                    return 'green';
                } else if (this.addScopeStart) {
                    return 'orange';
                } else {
                    return 'gray';
                }
            case 4:
                if (this.addTargetStart) {
                    return 'orange';
                } else if (this.addTargetComplete) {
                    return 'green';
                } else {
                    return 'gray';
                }
        }
    }

    dk() {
        this.allIsComplete = !this.allIsComplete;
    }
}
