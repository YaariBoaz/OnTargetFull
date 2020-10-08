import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonSlides, Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {InitService} from '../shared/services/init.service';
import {BleService} from '../shared/services/ble.service';
import {UserService} from '../shared/services/user.service';
import {NetworkService} from '../shared/services/network.service';
import {StorageService} from '../shared/services/storage.service';
import {DashboardModel} from '../shared/models/dashboard-model';
import {HistoryModel} from '../shared/models/HistoryModel';
import {Tab1Service} from './tab1-service.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import {TabsService} from '../tabs/tabs.service';
import {Chart} from 'chart.js';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('slides', {static: false}) slides: IonSlides;
    @ViewChild('lineChart', {static: false}) lineChart;
    @ViewChild('scatter', {static: false}) scatter;
    @ViewChild('radio', {static: false}) radio;

    line: any;
    scatterChartIns;
    radioChartInst;

    colorArray: any;

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
    slideOpts = {
        slidesPerView: 1,
        spaceBetween: 0
    };

    hasConnection: boolean;
    data: DashboardModel;
    historicTrainings = {};
    points = 0;
    showUi = false;

    constructor(private platform: Platform,
                private networkService: NetworkService,
                private router: Router,
                private tab1Service: Tab1Service,
                private userService: UserService,
                private zone: NgZone,
                private ble: BleService,
                private tabsService: TabsService,
                private initService: InitService,
                private screenOrientation: ScreenOrientation,
                private storageService: StorageService) {
        console.log('In constructor Tab1Page' + new Date());
    }

    ngOnInit(): void {
        if (!localStorage.isLoggedIn) {
            this.router.navigateByUrl('/signin');
        } else {
            this.showUi = true;
            console.log('In ngOnInit START Tab1Page' + new Date());
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
            this.profile = this.userService.getUser();
            this.handleOfflineScenario();
            this.tabsService.$notifyTab1.subscribe(() => {
                this.handleOfflineScenario();
            });
            setTimeout(() => {
                this.createLineChart();
                this.createScatterChart();
                this.createRadioChart();
            }, 1000);
            this.initService.isLoading.next(false);

            console.log('In ngOnInit END Tab1Page' + new Date());
        }
    }


    onDiscconectTarget() {
        this.ble.distory();
    }

    createLineChart() {
        if (this.lineChart.nativeElement) {

        }
        this.line = new Chart(this.lineChart.nativeElement, {
            type: 'line',
            data: {
                labels: [100, 250, 200, 450, 300, 600],
                datasets: [
                    {
                        data: [100, 250, 200, 450, 300, 600],
                        label: 'Africa',
                        borderColor: '#ce564b',
                        fill: false
                    }
                ]
            },
            options: {
                elements: {
                    line: {
                        tension: 0,
                        borderWidth: 2,
                    },
                    point: {
                        radius: 0
                    }
                },
                legend: {
                    display: false
                },
                responsive: true,
                title: {
                    display: false,
                },
                scales: {
                    xAxes: [{
                        display: false,

                    }],
                    yAxes: [{
                        display: false,

                    }]
                }
            }

        });
    }

    createScatterChart() {
        this.scatterChartIns = new Chart(this.scatter.nativeElement, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Scatter Dataset',
                        borderColor: '#ce564b',
                        pointBackgroundColor: '#ce564b',
                        fill: false,
                        data: [
                            {
                                x: 1,
                                y: 0
                            },
                            {
                                x: 0,
                                y: 2
                            },
                            {
                                x: 3,
                                y: 1
                            },
                            {
                                x: 4,
                                y: 2.5
                            },
                            {
                                x: 5,
                                y: 1
                            },
                            {
                                x: 6,
                                y: 0
                            }

                        ]
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                responsive: true,
                title: {
                    display: false,
                },
                elements: {
                    point: {
                        radius: 5,
                    }
                },
                layout: {
                    padding: {
                        left: 25,
                        right: 5,
                        bottom: 20,
                        top: 15
                    }
                },
                scales: {
                    xAxes: [
                        {
                            type: 'linear',
                            position: 'bottom',
                            display: false,
                        }
                    ],
                    yAxes: [
                        {
                            display: false,
                        }
                    ]
                }
            }
        });
    }

    createRadioChart() {
        this.radioChartInst = new Chart(this.radio.nativeElement, {
            type: 'doughnut',
            data: {
                labels: ['Africa', 'Asia', 'Europe', 'Latin America', 'North America'],
                datasets: [
                    {
                        borderColor: '#1C00ff00',
                        label: 'Population (millions)',
                        backgroundColor: ['#ce564b', '#d4d4d4'],
                        data: [this.data.hitRatioChart.totalHits, this.data.hitRatioChart.totalShots]
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                responsive: true,
                title: {
                    display: false,
                },
                scales: {
                    xAxes: [{
                        display: false,

                    }],
                    yAxes: [{
                        display: false,

                    }]
                },
                cutoutPercentage: 90
            }
        });
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
        this.router.navigateByUrl('home/tabs/tab1/activity-history');
    }

    private handleOnlineScenario() {

    }

    private handleOfflineScenario() {
        this.data = this.storageService.getItem('homeData');
        if (this.data.trainingHistory) {
            this.extractPoints();
        }
        if (this.data.hitRatioChart) {
            this.hits = this.data.hitRatioChart.totalHits;
            this.shots = this.data.hitRatioChart.totalShots;
        }


        // this.tab1Service.setTextInCenterForHitRatio(this.hitRatioChart);
        console.log('---DATA--- ' + this.data);
        if (this.data.trainingHistory) {
            this.data.trainingHistory.forEach(train => {
                const monthName = new Date(train.drillDate).toLocaleString('default', {month: 'long'});
                if (!(this.historicTrainings[monthName])) {
                    this.historicTrainings[monthName] = {};
                }
                const tempDate = new Date(train.drillDate);
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

    }

    datesAreOnSameDay(first, second) {
        return first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate();
    }

    ngAfterViewInit() {

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

