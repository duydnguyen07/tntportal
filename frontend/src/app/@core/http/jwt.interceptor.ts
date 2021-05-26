import { Router } from '@angular/router';
import { CredentialsService } from '@app/auth/credentials.service';
import { AuthenticationService } from '@app/auth/authentication.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(!this.credentialsService.credentials) {
      return next.handle(request);
    }

    const accessToken = this.credentialsService.credentials?.jwt

    request = request.clone({
      setHeaders: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if(this.jwtHelper.isTokenExpired(accessToken)) {
      this.authenticationService.logout();
      this.router.navigate(['signed-out'])
      return EMPTY;
    } else {
      return next.handle(request);
    }
  }
}
