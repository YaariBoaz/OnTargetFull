import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {InitService} from '../services/init.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanLoad {

    constructor(private router: Router, private initService: InitService) {
    }


    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        // debugger;
        // const val = localStorage.isLoggedIn;
        // if (!val) {
        //     this.router.navigateByUrl('/signin');
        //     return false;
        // } else {
        //     const boolValue = val.toLowerCase() === 'true' ? true : false;
        //     return true;
        // }
        return true;
    }

}



