import { Pipe, PipeTransform } from '@angular/core';
/*
 * Pipe for iterate over dictionary-like object-map
 * (for using *ngFor like in ng1 )
 * <div *ngFor="#keyValuePair of dict | keyValue">
 *      This is the key {{keyValuePair.key}} and this is the value {{keyValuePair.val}} !
 * </div>
 */
@Pipe({
    name: 'getKeyValuePair'
})
export class getKeyValuePair {
    transform(dict: Object): Array<Object> {
        var a = [];
        for (var key in dict) {
            if (dict.hasOwnProperty(key)) {
                a.push({key: key, val: dict[key]});
            }
        }
        return a;
    }
}


@Pipe({ name: 'objValuesPipe',  pure: false })
export class objValuesPipe implements PipeTransform {
    transform(value: any, args: any[] = null): any {
        return Object.keys(value).map(key => value[key]);
    }
}
