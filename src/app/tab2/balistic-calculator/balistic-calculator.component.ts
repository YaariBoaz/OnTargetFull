import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../../shared/services/storage.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Chart} from 'chart.js';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {ShootingService} from '../../shared/services/shooting.service';
import {BalisticCalculatorService} from '../../shared/services/balistic-calculator.service';
import {ZeroTableGetObject} from '../../shared/services/api.service';


@Component({
    selector: 'app-balistic-calculator',
    templateUrl: './balistic-calculator.component.html',
    styleUrls: ['./balistic-calculator.component.scss'],
})
export class BalisticCalculatorComponent implements OnInit, AfterViewInit {
    @ViewChild('lineChart') lineChart;
    bulletName;
    caliber;
    drill: any;
    myGuns: any;
    tableData;
    chartAndTableData;
    dataModel: ZeroTableGetObject = {
        ballisticCoefficient: 0,
        initialVelocity: 0,
        sightHeight: 2.5,
        zeroRange: 250,
        boreAngle: 0,
        windangle: 90,
        yIntercept: 0,
        altitude: 0,
        barometer: 29.59,
        temperature: 59,
        relativeHumidity: 0.5,
        windSpeed: 0,
        isMetric: true
    };
    isParamsScreen = true;
    private line: Chart;
    caliberList;
    moa = 0;

    constructor(private storageService: StorageService,
                private shootingService: ShootingService,
                private baliticCalculatorService: BalisticCalculatorService,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<BalisticCalculatorComponent>) {
        this.myGuns = this.storageService.getItem('gunList');
    }

    ngOnInit() {
        this.dataModel.ballisticCoefficient = this.data.ballisticCoefficient;
        this.dataModel.initialVelocity = this.data.initialVelocity;
        this.dataModel.sightHeight = this.data.sightHeight;
        this.caliber = this.shootingService.caliber;
        this.bulletName = this.shootingService.bulletName;
        this.caliberList = this.storageService.getItem('caliberList');
    }

    onBackPressed() {

    }


    createLineChart() {
        const paths = [];
        Object.keys(this.chartAndTableData).forEach(key => {
            paths.push(this.chartAndTableData[key].path);
        });
        const zeros = [];
        paths.forEach(item => {
            zeros.push(0);
        });
        if (this.lineChart && this.lineChart.nativeElement) {
            this.line = new Chart(this.lineChart.nativeElement, {
                type: 'line',
                data: {
                    labels: Object.keys(this.chartAndTableData),
                    datasets: [
                        {data: paths, borderColor: 'rgb(77, 137, 246)', fill: false, label: '1', showLine: true},
                        {data: zeros, borderColor: 'rgb(192, 75, 75)', fill: false, label: '2', showLine: true},
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
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: 1
                            },
                            gridLines: {
                                zeroLineColor: '#ff0000',
                            }
                        }]
                    },
                },


            });
        }
    }

    ngAfterViewInit(): void {

    }

    changeScreen() {
        this.baliticCalculatorService.getZeroTable(this.dataModel).subscribe((data: any) => {


            this.shootingService.zeroTable = data;
            this.chartAndTableData = data;
            this.tableData = [];
            Object.keys(this.chartAndTableData).forEach(key => {
                if (Math.round(this.chartAndTableData[key].range) === this.shootingService.selectedDrill.range) {
                    this.baliticCalculatorService.moa = this.chartAndTableData[key].moa;
                }
                this.tableData.push({
                    x: key,
                    y: this.chartAndTableData[key].path,
                    t: this.chartAndTableData[key].time
                });
            });
            this.isParamsScreen = !this.isParamsScreen;
            setTimeout(() => {
                this.createLineChart();
            }, 100);
        });

    }

    startSession() {
        this.shootingService.setIsZero(true);
        this.shootingService.drillStarteEvent.next(true);
        this.dialogRef.close();
    }
}


