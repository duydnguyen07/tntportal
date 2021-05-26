import { PATHS } from './../../app.model';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ApplicationService } from '@core/application-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { first, catchError, finalize } from 'rxjs/operators';
import { Controls, FormConfig, FormState } from '@app/@shared/application-form/application-form.model';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UpperCasePipe]
})
export class NewApplicationComponent implements OnInit {

  isSubmitting: boolean = false;
  
  get now() {
    return new Date();
  }

  constructor(
    private activatedRoute: ActivatedRoute, 
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private uppercase: UpperCasePipe
  ) { 
  }

  ngOnInit(): void {
  }

  createNewEntry(controls: Controls) {
    this.isSubmitting = true;
    const passcode: string = this.uppercase.transform(this.getRandomePasscode());
    const data: Controls = {
      ...controls,
      state: FormState.New
    }


    this.applicationService.create(data, passcode).pipe(
      first(),
      catchError((errorResponse: HttpErrorResponse) => {

        if(errorResponse?.error?.data?.errors) {
          const errors = errorResponse?.error?.data?.errors

          let errorStr = ''
          for(const error in errors){
            errorStr = errors[error].join('<br>');
          }
          this.snackBar.open(errorStr, "Close")
        } else {
          this.snackBar.open('Something has went wrong, please try again later.', 'Close')
        }

        return of(errorResponse)
      }),
      finalize(() => {
        this.isSubmitting = false;
      })
    ).subscribe((res: HttpErrorResponse|FormConfig) => {
      if((res as HttpErrorResponse)?.ok === false) return;

      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        disableClose: true
      })

      dialogRef.afterClosed().pipe(first()).subscribe(() => {
        this.router.navigate([PATHS.application.base ,(res as FormConfig).id], {
          state: {passcode}
        })
      });
    })
  }

  private getRandomePasscode(): string {
    return Math.random().toString(36).substring(2, 3) + Math.random().toString(36).substring(2, 7);
  }
}
