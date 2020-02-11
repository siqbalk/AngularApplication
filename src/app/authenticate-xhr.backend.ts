import { Injectable } from '@angular/core';
import { Request, XHRBackend, BrowserXhr, ResponseOptions, XSRFStrategy, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable()
export class AuthenticateXhr extends XHRBackend {
    // tslint:disable-next-line:variable-name
    constructor(_browserXhr: BrowserXhr, _baseResponseOptions: ResponseOptions, _xsrfStrategy: XSRFStrategy) {
        super(_browserXhr, _baseResponseOptions, _xsrfStrategy);
    }

    createConnection(request: Request) {
        // tslint:disable-next-line:prefer-const
        let xhrConnection = super.createConnection(request);
        xhrConnection.response = xhrConnection.response.pipe(catchError(error =>  {
            if ((error.status === 401 || error.status === 403) && (window.location.href.match(/\?/g) || []).length < 2) {
                // tslint:disable-next-line:no-trailing-whitespace
                
                console.log('The authentication session expired or the user is not authorized. Force refresh of the current page.');
                // tslint:disable-next-line:no-trailing-whitespace
                /* Great solution for bundling with Auth Guard! 

                1. Auth Guard checks authorized user (e.g. by looking into LocalStorage)
                // tslint:disable-next-line:no-trailing-whitespace
                2. On 401/403 response you clean authorized user for the Guard (e.g. by removing coresponding parameters in LocalStorage).
                3. As at this early stage you can't access the Router for forwarding to the login page,
                4. refreshing the same page will trigger the Guard checks, which will forward you to the login screen */
                // tslint:disable-next-line:no-trailing-whitespace
                localStorage.removeItem('auth_token');              
                // tslint:disable-next-line:no-trailing-whitespace
                window.location.href = window.location.href + '?' + new Date().getMilliseconds();             
            }
            return Observable.throw(error);
        }));
        return xhrConnection;
    }

}
