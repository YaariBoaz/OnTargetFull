import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonSlides, Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {UserService} from '../shared/services/user.service';
import {NetworkService} from '../shared/services/network.service';
import {LineChartMetaData, lineChartMetaData} from './charts/line';
import {StorageService} from '../shared/services/storage.service';
import {DashboardModel} from '../shared/models/dashboard-model';
import {DoghnuChartMetaData, doghnuChartMetaData} from './charts/doghnut';
import {HistoryModel} from '../shared/models/HistoryModel';
import {HitrationDataModel, Tab1Service} from './tab1-service.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('slides', {static: false}) slides: IonSlides;
    private hitRatiochart: am4charts.PieChart;
    private rateOfFireChart: am4charts.XYChart;

    hits;
    shots;
    slideIndex = 0;
    profile;
    options = {
        borderWidth: [0, 0, 0, 0],
        height: 10

    };
    private hasConnection: boolean;
    private data: DashboardModel;
    historicTrainings = {};
    points = 0;

    constructor(private platform: Platform,
                private networkService: NetworkService,
                private router: Router,
                private tab1Service: Tab1Service,
                private userService: UserService,
                private zone: NgZone,
                private storageService: StorageService) {

    }

    ngOnInit(): void {
        this.profile = this.userService.getUser();
        this.handleOfflineScenario();
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

    onActivityClicked(train: HistoryModel) {
        this.storageService.passhistoricalTrainingsDate(train);
        this.router.navigate(['/home/tabs/tab1/activity-history']);
    }

    private handleOnlineScenario() {

    }

    private handleOfflineScenario() {
        this.data = this.storageService.getItem('homeData');
        if (this.data.trainingHistory) {
            this.extractPoints();
        }
        this.hits = this.data.hitRatioChart.totalHits;
        this.shots = this.data.hitRatioChart.totalShots;
        // this.tab1Service.setTextInCenterForHitRatio(this.hitRatioChart);
        console.log('---DATA--- ' + this.data);
        this.data.trainingHistory.forEach(train => {
            const monthName = new Date(train.date).toLocaleString('default', {month: 'long'});
            if (!(this.historicTrainings[monthName])) {
                this.historicTrainings[monthName] = {};
            }
            const tempDate = new Date(train.date);
            const key = tempDate.getDate() + '.' + (tempDate.getMonth() + 1) + '.' + tempDate.getFullYear();
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

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            this.setupHitratioChart();
            this.setupRateOfFireChart();

        });
    }

    ngOnDestroy() {
        this.zone.runOutsideAngular(() => {
            if (this.hitRatiochart) {
                this.hitRatiochart.dispose();
            }
        });
    }

    private setupHitratioChart() {
        this.hitRatiochart = am4core.create('chartdiv', am4charts.PieChart);
        const {data} = this.tab1Service.setupDataForHitration(this.data.hitRatioChart);

        this.hitRatiochart.data = [{
            text: 'Hits',
            litres: data[0],
            color: '#df9e46'
        }, {
            text: 'Misses',
            litres: data[1],
            color: '#d9d9d9'
        }];

// Set inner radius
        this.hitRatiochart.innerRadius = am4core.percent(50);

// Add and configure Series
        const pieSeries = this.hitRatiochart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = 'litres';
        pieSeries.dataFields.category = 'text';
        pieSeries.slices.template.stroke = am4core.color('#fff');
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;

// This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;
        pieSeries.labels.template.disabled = true;
        pieSeries.slices.template.tooltipText = '';
        pieSeries.slices.template.propertyFields.fill = 'color';

        const label = pieSeries.createChild(am4core.Label);
        label.text = data[0] + '% Hits';
        label.horizontalCenter = 'middle';
        label.verticalCenter = 'middle';
        label.fontSize = 25;

    }

    private setupRateOfFireChart() {
        this.rateOfFireChart = am4core.create('rateOfFireChart', am4charts.XYChart);
        this.rateOfFireChart.data = [{
            country: 'world',
            visits: 2025,
            color: '#df9e46'
        }, {
            country: 'user',
            visits: 1882,
            color: '#d9d9d9'
        }];

// Create axes

        const categoryAxis = this.rateOfFireChart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = 'country';
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        categoryAxis.renderer.labels.template.adapter.add('dy', (dy, target) => {
            // tslint:disable-next-line:no-bitwise
            // @ts-ignore
            // tslint:disable-next-line:no-bitwise
            if (target.dataItem && target.dataItem.index & 2 === 2) {
                return dy + 25;
            }
            return dy;
        });

        const valueAxis = this.rateOfFireChart.yAxes.push(new am4charts.ValueAxis());

// Create series
        const series = this.rateOfFireChart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = 'visits';
        series.dataFields.categoryX = 'country';
        series.name = 'Visits';
        series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
        series.columns.template.fillOpacity = .8;
        series.columns.template.propertyFields.fill = 'color';
        const columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;
    }

    private extractPoints() {
        this.data.trainingHistory.forEach((train) => {
            this.points += train.points;
        });
    }
}



