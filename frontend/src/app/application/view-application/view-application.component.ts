import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationService, ErrorCode } from '@core/application-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { catchError, first, map, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Controls, FormConfig } from '@app/@shared/application-form/application-form.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewApplicationComponent implements OnInit {
  isFetching: boolean = false;
  errorMessage: string = '';
  workorder: Controls = null;
  passcode: string = null;
  passcordControl: FormControl = new FormControl('');

  constructor(
    private activatedRoute: ActivatedRoute,
    private applicationService: ApplicationService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { 
    this.passcode = this.router.getCurrentNavigation().extras?.state?.passcode;
  }

  ngOnInit(): void {
    this.getApplicationId().subscribe((id: string) => {
      if(!!id && !!this.passcode) {
        this.fetchWorkOrder(id, this.passcode);
      }
    })
  }

  submitPasscodeAndFetch() {
    this.getApplicationId().subscribe((id) => {
      this.fetchWorkOrder(id, this.passcordControl.value)
    })
  }

  private getApplicationId() {
    return this.activatedRoute.params.pipe(
      first(),
      map((params) => params?.id)
    );
  }

  private fetchWorkOrder(id: string, passcode: string) {
    this.isFetching = true;
    this.applicationService.getWithPasscode(id,passcode).pipe(
      first(),
      finalize(() => {
        this.isFetching = false;
        this.cdr.detectChanges();
      })
    ).subscribe(
      (res: Controls) => {
        this.workorder = res;

      }, (err: HttpErrorResponse) => {
        if(err.status === 400) {
          if((err.error.ERROR_CODE as ErrorCode) === 'ID_INVALID') {
            this.errorMessage = "The application you are trying to view is not accessible. Please make sure you are using the right link."
          } else if((err.error.ERROR_CODE as ErrorCode) === 'PASSCODE_INVALID') {
            this.errorMessage = "The passcode is not correct, please try again."
          }
        } else {
          this.errorMessage = err.message;
        }
        this.cdr.detectChanges();
      }
    )
  }

}
