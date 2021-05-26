import { CredentialsService } from '@app/auth/credentials.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { catchError, finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@core';
import { AuthenticationService } from '../authentication.service';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('Login');

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  // .pipe(
  //   map((cred: Credentials) => {
  //     this.credentialsService.setCredentials(cred, context.remember);
  //     return cred
  //   }),

  // )

  login() {
    this.isLoading = true;
    const loginFormValue: {
      username: string,
      password: string,
      remember: boolean,
    } = this.loginForm.value;

    const login$ = this.authenticationService.login(loginFormValue);
    login$
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials) => {
          log.debug(`${credentials.user.username} successfully logged in`);
          this.credentialsService.setCredentials(credentials, loginFormValue.remember);
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        (error: HttpErrorResponse) => {
          log.debug(`Login error: ${error}`);
          this.error = error.message;
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true,
    });
  }
}
