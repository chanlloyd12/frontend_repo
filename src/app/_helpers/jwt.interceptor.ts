import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AccountService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if account is logged in and request is to the api url
        const account = this.accountService.accountValue;
        const isLoggedIn = account && account.jwtToken;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        
        // 🔑 FIX: Add withCredentials to ALL API requests to enable cookie sending
        // This is critical for the /refresh-token endpoint to send the cookie cross-origin (Vercel to Render).
        if (isApiUrl) {
            request = request.clone({
                withCredentials: true
            });
        }
        
        // Add the JWT Access Token only if the user is logged in
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${account.jwtToken}` }
            });
        }

        return next.handle(request);
    }
}


// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// import { Observable } from 'rxjs';

// import { environment } from '@environments/environment';
// import { AccountService } from '@app/_services';

// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//     constructor(private accountService: AccountService) { }

//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         // add auth header with jwt if account is logged in and request is to the api url
//         const account = this.accountService.accountValue;
//         const isLoggedIn = account && account.jwtToken;
//         const isApiUrl = request.url.startsWith(environment.apiUrl);
//         if (isLoggedIn && isApiUrl) {
//             request = request.clone({
//                 setHeaders: { Authorization: `Bearer ${account.jwtToken}` }
//             });
//         }

//         return next.handle(request);
//     }
// }