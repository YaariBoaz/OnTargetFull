import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {ShootingService} from '../../services/shooting.service';
import {Router} from '@angular/router';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';

@Component({
    selector: 'app-new-target-design',
    templateUrl: './new-target-design.component.html',
    styleUrls: ['./new-target-design.component.scss'],
})
export class NewTargetDesignComponent implements OnInit {
    @Output() startDrillFromChallenge = new EventEmitter<string>();

    challenge;
    best = '';
    mine = '';

    constructor(private shootingService: ShootingService, private router: Router, private screenOrientation: ScreenOrientation,) {
        this.challenge = this.shootingService.challenge;
        this.setBestScore();
        this.setMyScore();
    }

    ngOnInit() {
    }

    onStartChallenge() {
        this.startDrillFromChallenge.emit();
    }

    onBackPressed() {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.router.navigateByUrl('choose');
    }

    setBestScore() {
        if (this.challenge.metadata.useBestGrouping) {
            this.best = this.challenge.challengeRank.bestGrouping;
        }
        if (this.challenge.metadata.useDisFromCenter) {
            this.best = this.challenge.challengeRank.bestDisFromCenter;
        }
        if (this.challenge.metadata.useHighestScore) {
            this.best = this.challenge.challengeRank.highestScore;
        }
        if (this.challenge.metadata.usePistol) {

        }
        if (this.challenge.metadata.useSplitTime) {
            this.best = this.challenge.challengeRank.bestSplitTime;
        }
        if (this.challenge.metadata.useTotalTime) {
            this.best = this.challenge.challengeRank.bestTotalTime;
        }
    }

    setMyScore() {

        if (this.challenge.metadata.useBestGrouping) {
            this.mine = this.challenge.challengeRank.userBestGrouping;
        }
        if (this.challenge.metadata.useDisFromCenter) {
            this.mine = this.challenge.challengeRank.userBestDisFromCenter;
        }
        if (this.challenge.metadata.useHighestScore) {
            this.mine = this.challenge.challengeRank.userHighestScore;
        }
        if (this.challenge.metadata.useSplitTime) {
            this.mine = this.challenge.challengeRank.userBestSplitTime;
        }
        if (this.challenge.metadata.useTotalTime) {
            this.mine = this.challenge.challengeRank.userBestTotalTime;
        }
    }
}
