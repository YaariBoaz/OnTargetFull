import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'makeItNormal'
})
export class MakeItNormalTextPipe implements PipeTransform {

    transform(value: string,): string {
        if (typeof value !== 'string' || !value) {
            return
        }

        const result = value.replace(/([A-Z])/g, " $1");
        return  result.charAt(0).toUpperCase() + result.slice(1);
    }
}
