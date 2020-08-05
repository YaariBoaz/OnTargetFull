import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {InitService} from '../services/init.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private router: Router, private initService: InitService) {
    }


    // tslint:disable-next-line:max-line-length
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const isRegistered = this.initService.isRegistered();
        if (isRegistered) {
            // this.router.navigateByUrl('/home/tabs/tab1');
            this.router.navigateByUrl('');
        }
        return true;
    }
}
