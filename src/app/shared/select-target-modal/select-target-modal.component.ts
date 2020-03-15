import {Component, OnInit} from '@angular/core';
import {ShootingService} from '../services/shooting.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {StorageService} from '../services/storage.service';

@Component({
    selector: 'app-select-target-modal',
    templateUrl: './select-target-modal.component.html',
    styleUrls: ['./select-target-modal.component.scss'],
})
export class SelectTargetModalComponent implements OnInit {
    targets = [];
    BASE_URL_HTTP = '192.168.0.86:8087';
    socket;
    GET_TARGETS_API;

    myTargets = [];

    constructor(private http: HttpClient,
                private storageService: StorageService,
                private shootingService: ShootingService,
                private router: Router) {
        this.myTargets = this.storageService.getItem('targetList');

        // if (!this.shootingService.getBaseUrl()) {
        //     this.storage.get('ip').then((data) => {
        //         if (!data) {
        //             alert('You did not enter host, You will be routed to the IP page');
        //             this.router.navigateByUrl('/home/tabs/tab3');
        //         } else {
        //             this.shootingService.setBaseUrl(data);
        //             this.shootingService.setTargetsI();
        //         }
        //     });
        // } else {
        //     this.targets = this.shootingService.targets;
        // }
    }

    ngOnInit() {
        // this.shootingService.targetsArrived.subscribe((data) => {
        //     if (data) {
        //         this.targets = data;
        //     } else {
        //         alert('Check your internet connection or the IP you entered');
        //     }
        // });
    }

    getOnlineTargets() {
        this.http.get(this.GET_TARGETS_API).subscribe((data: any) => {
            this.targets = data;
        });
    }


    onTargetChosen(target) {
        this.shootingService.chosenTarget = target;
        this.router.navigateByUrl('/home/tabs/tab2/select2');
    }

    startTraining() {
        this.router.navigateByUrl('/home/tabs/tab2/select2');
    }

    onBackPressed() {
        this.router.navigateByUrl('/home/tabs/tab2');
    }

    onGetTargets() {
        this.shootingService.setTargetsI();
    }
}
