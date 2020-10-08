import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError, BehaviorSubject} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {InitService} from "../../shared/services/init.service";
import {Injectable} from '@angular/core';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private initService: InitService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errorMsg = '';
                    if (error.error instanceof ErrorEvent) {
                        console.log('this is client side error');
                        errorMsg = `Error: ${error.error.message}`;
                        this.initService.notifyOnErrorFunc(errorMsg);

                    } else {
                        console.log('this is server side error');
                        errorMsg = 'Something Went Wrong, Please Try Again'
                        this.initService.notifyOnErrorFunc(errorMsg);
                    }
                    console.log(errorMsg);
                    return throwError(errorMsg);
                })
            )
    }
}
