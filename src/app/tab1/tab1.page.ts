import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSlides, Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {UserService} from '../shared/services/user.service';
import {NetworkService} from '../shared/services/network.service';
import {LineChartMetaData, lineChartMetaData} from './charts/line';
import {StorageService} from '../shared/services/storage.service';
import {DashboardModel} from '../shared/models/dashboard-model';
import {DoghnuChartMetaData, doghnuChartMetaData} from './charts/doghnut';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
    @ViewChild('slides', {static: false}) slides: IonSlides;

    doghnuChartMetaData: DoghnuChartMetaData;
    lineChartMetaData: LineChartMetaData;
    slideIndex = 0;
    profile;
    options = {
        borderWidth: [0, 0, 0, 0],
        height: 10

    };
    private hasConnection: boolean;
    private data: DashboardModel;
    historicTrainings = {};

    constructor(private platform: Platform,
                private networkService: NetworkService,
                private router: Router,
                private userService: UserService,
                private storageService: StorageService) {
        this.doghnuChartMetaData = doghnuChartMetaData;
        this.lineChartMetaData = lineChartMetaData;
        this.profile = this.userService.getUser();
        this.handleOfflineScenario();
    }


    ngOnInit(): void {
        
    }

    slideChanged() {
        this.slides.getActiveIndex().then((index: number) => {
            this.slideIndex = index;
            console.log('currentIndex:', index);
        });
    }

    onNextSlide() {
        this.slides.slideNext(1000);
    }

    onPrevSlide() {
        this.slides.slidePrev(1000);
    }

    onActivityClicked(train) {
        this.storageService.passhistoricalTrainingsDate(train);
        this.router.navigate(['/home/tabs/tab1/activity-history']);
    }

    private handleOnlineScenario() {

    }

    private handleOfflineScenario() {
        this.data = this.storageService.getItem('homeData');
        console.log('---DATA--- ' + this.data);
        this.data.trainingHistory.forEach(train => {
            const monthName = new Date(train.date).toLocaleString('default', {month: 'long'});
            if (!(this.historicTrainings[monthName])) {
                this.historicTrainings[monthName] = {};
            }
            const tempDate = new Date(train.date);
            const key = tempDate.getDay() + '.' + tempDate.getMonth() + '.' + tempDate.getFullYear();
            const day = new Date(tempDate).toLocaleString('default', {weekday: 'long'});
            if ((!this.historicTrainings[monthName][key])) {
                this.historicTrainings[monthName][key] = {
                    data: [],
                    day
                };
            }
            this.historicTrainings[monthName][key].data.push(train);
        });
    }

    datesAreOnSameDay(first, second) {
        return first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate();
    }
}



