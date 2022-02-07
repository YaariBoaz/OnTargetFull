import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {ChallengesService} from '../challenges.service';
import {Router} from '@angular/router';
import {ShootingService} from '../../services/shooting.service';
import {DrillType} from '../../../tab2/tab2.page';
import {TargetType} from '../../drill/constants';

@Component({
    selector: 'challenge-list',
    templateUrl: './challenge-list.component.html',
    styleUrls: ['./challenge-list.component.scss'],
})
export class ChallengeListComponent implements OnInit {
    bestResultSentence = 'Best Result Is: \n';
    activeTab = 'assault';

    optionsToRender = {
        assault: ['middleEast', 'shootingInTheDark', 'sniper', 'operationInRussia', 'middleEast', 'shootingInTheDark', 'sniper', 'operationInRussia'],
        sideArms: ['operationInRussia', 'sniper', 'shootingInTheDark', 'middleEast', 'operationInRussia', 'sniper', 'shootingInTheDark', 'middleEast'],
    };

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private shootingService: ShootingService) {

        const targetTypeParsed = this.setTargetTypeForFilter('003');

        this.data = data.metaData;
        this.data = data.filter(o => this.showDrill(o.metadata.targetType));
        this.data.forEach(item => {
            if (!item.bestResultSentence) {
                item.bestResultSentence = 'Best Result Is: \n\'';
            }
            if (item.metadata.useDisFromCenter) {
                item.bestResultSentence += item.challengeRank.bestDisFromCenter;
            }
            if (item.metadata.useSplitTime) {
                item.bestResultSentence += item.challengeRank.bestDisFromCenter;

            }
            if (item.metadata.useBestGrouping) {
                item.bestResultSentence += item.challengeRank.bestDisFromCenter;

            }
            if (item.metadata.useTotalTime) {
                item.bestResultSentence += item.challengeRank.bestDisFromCenter;
            }
        });
    }


    ngOnInit() {


    }

    onChallengeChosen(challenge: any) {
        if (challenge.metadata.drillType === 'HitNoHit') {
            challenge.metadata.drill = DrillType.HitNoHit;
            challenge.metadata.drillType = DrillType.HitNoHit;
        } else {
            challenge.metadata.drill = DrillType.Regular;
            challenge.metadata.drillType = DrillType.Regular;
        }
        this.setTargetType(challenge.metadata);
        challenge.metadata.numOfBullets = challenge.metadata.numberOfBullets;
        this.shootingService.drillStarteEvent.next(true);
        this.shootingService.isChallenge = true;
        this.shootingService.numberOfBullersPerDrill = challenge.metadata.numberOfBullets;
        this.shootingService.challengeId = challenge.metadata.challengeId;
        this.shootingService.selectedDrill = challenge.metadata;
        this.router.navigateByUrl('/tab2/select2');
    }

    setTargetType(challenge) {
        if (challenge.targetType === '003' || challenge.targetType.indexOf('64') > -1) {
            challenge.targetType = TargetType.Type_64;
        } else if (challenge.targetType.indexOf('128') > -1) {
            challenge.targetType = TargetType.Type_128;

        } else if (challenge.targetType.indexOf('16') > -1) {
            challenge.targetType = TargetType.Type_16;

        } else {
            challenge.targetType = TargetType.HitNoHit;
        }
    }

    setTargetTypeForFilter(name) {
        if (name === '003' || name.indexOf('64') > -1) {
            return TargetType.Type_64;
        } else if (name.indexOf('128') > -1) {
            return TargetType.Type_128;

        } else if (name.indexOf('16') > -1) {
            return TargetType.Type_16;

        } else {
            return TargetType.HitNoHit;
        }
    }

    private showDrill(targetType) {
        if (targetType === '003' || targetType.indexOf('64') > -1 || targetType.indexOf('128') > -1) {
            return true;
        } else if (targetType.indexOf('Hit') > -1) {
            return true;
        }
    }
}


