export const lineChartMetaData: LineChartMetaData = {
    lineChartOptions: {
        annotation: undefined,
        responsive: true
    },
    lineChartColors: [
        {
            borderColor: 'rgba(165,207,238)',
            backgroundColor: 'transparent'
        },
    ],
};

export interface LineChartMetaData {
    lineChartOptions: any;
    lineChartColors: any;
}

