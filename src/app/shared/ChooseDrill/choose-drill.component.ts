import {Component, OnInit} from '@angular/core';
import {ChallengesService} from './challenges.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ChallengeListComponent} from './List/challenge-list.component';
import {ShootingService} from '../services/shooting.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-activity-log',
    templateUrl: './choose-drill.component.html',
    styleUrls: ['./choose-drill.component.scss'],
})
export class ChooseDrillComponent implements OnInit {
    constructor(private challengesService: ChallengesService,
                public dialog: MatDialog,
                private shootingService: ShootingService,
                private router: Router) {
    }

    ngOnInit() {

    }


    onBuildDrillClicked() {
        this.router.navigateByUrl('/tab2/select');
    }

    onBackPressed() {
        this.router.navigateByUrl('/home');
    }
}
