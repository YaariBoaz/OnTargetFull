import {Injectable} from '@angular/core';
import {HitRatioChart} from '../shared/models/dashboard-model';

@Injectable({
    providedIn: 'root'
})
export class Tab1Service {

    constructor() {
    }

    setupDataForHitration(hitRatioRawData: HitRatioChart): HitrationDataModel {
        if (hitRatioRawData.totalShots === 0 && hitRatioRawData.totalHits === 0) {
            return new HitrationDataModel();
        }
        const hitPrecentage: number = (hitRatioRawData.totalHits / hitRatioRawData.totalShots) * 100;
        const hitRatio = new HitrationDataModel();
        hitRatio.data = [hitPrecentage, 100 - hitPrecentage];
        return hitRatio;
    }



    setTextInCenterForHitRatio(chart) {
        const ctx = chart.ctx;
        const txt = 'Center Text';

        const sidePadding = 60;
        const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

        const stringWidth = ctx.measureText(txt).width;
        const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        const widthRatio = elementWidth / stringWidth;
        const newFontSize = 25;
        const elementHeight = (chart.innerRadius * 2);

        // Pick a new font size so it will not be larger than the height of label.
        const fontSizeToUse = Math.min(newFontSize, elementHeight);

        ctx.font = fontSizeToUse + 'px Open Sans';
        ctx.fillStyle = '#c39352';

        // Draw text in center
        ctx.fillText('67%', centerX, centerY);
    }

}


export class HitrationDataModel {
    data: [number, number] = [0, 0];

    constructor() {
    }


}
