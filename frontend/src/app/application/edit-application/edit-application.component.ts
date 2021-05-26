import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '@app/@core';
import { Controls, FormState } from '@app/@shared/application-form/application-form.model';
import { CanComponentDeactivate } from '@app/@shared/can-deactivate/can-component-deactivate';
import { first, map, finalize } from 'rxjs/operators';
import isEqual from 'lodash/isEqual';

@Component({
  selector: 'app-edit-application',
  template: `
    <div class="container">
      <div class="actions">
          <button mat-raised-button color="primary" [routerLink]="['home']">Back</button>
      </div>
      <ng-container *ngIf="errorMessage"> 
          <p class="error">{{errorMessage}}</p>
      </ng-container>
      <ng-container *ngIf="!!formControls">
          <app-application-form
              [disabledSubmit]="isFetching"
              [id]="formControls.id"
              [firstName]="formControls.firstName"
              [lastName]="formControls.lastName"
              [address]="formControls.address"
              [city]="formControls.city"
              [state]="formControls.state"
              [zipcode]="formControls.zipcode"
              [formState]="formControls.formState"
              [phone]="formControls.phone"
              [email]="formControls.email"
              [date]="formControls.date"
              [disableDate]="true"
              [year]="formControls.year"
              [make]="formControls.make"
              [model]="formControls.model"
              [license]="formControls.license"
              [mileage]="formControls.mileage"
              [vin]="formControls.vin"
              [price]="formControls.price"
              [acknowledgementText]="formControls.acknowledgementText"
              [initials]="formControls.initials"
              [readonly]="false"
              [certificate]="formControls.certificate"
              (formSubmit)="submitForm($event, formControls.id)"
              (formChanges)="liveFormData = $event"
          ></app-application-form>
      </ng-container>

      <app-loader class="center" [isLoading]="isFetching" size="2" [message]="'Loading application...'"></app-loader>

  </div>
  `,
  styleUrls: ['./edit-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditApplicationComponent extends CanComponentDeactivate implements OnInit {
  errorMessage: string;  
  isFetching: boolean = false;
  isFormLoaded: boolean = false;
  formControls: Controls;
  liveFormData: Controls;

  constructor(
    private activatedRoute: ActivatedRoute,
    private applicationService: ApplicationService,
    private cdr: ChangeDetectorRef
  ) { 
    super();
  }

  canDeactivate() {
    if(!this.isFormLoaded) {
      return true;
    } else {
      return isEqual(this.formControls, this.liveFormData);
    }
  }

  ngOnInit(): void {
    this.getApplicationId().subscribe((id: string) => {
      if(!!id) {
        this.fetchWorkOrder(id);
      } else {
        this.errorMessage = "Application Id is invalid";
      }
    })
  }

  submitForm(controls: Controls, id: number) {

    // Don't send if no change
    if(isEqual(this.formControls, this.liveFormData)) return;

    this.isFetching = true;
    const data: Controls = {
      ...controls,
      state: FormState.InProgress
    }
    this.applicationService.updateForm(data, id).pipe(
      first(),
      finalize(() => {
        this.isFetching = false
        this.cdr.detectChanges();
      })
    ).subscribe(
      (res: Controls) => {
        this.formControls = res;
      }, (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
      }
    )

  }

  private fetchWorkOrder(id: string) {
    this.isFetching = true;
    this.applicationService.get(id).pipe(
      first(),
      finalize(() => {
        this.isFetching = false
        this.cdr.detectChanges();
      }),
    ).subscribe(
      (res: Controls) => {
        this.formControls = res;
        console.log(this.formControls)
        this.isFormLoaded = true;
      }, 
      (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
      }
    )
  }

  private getApplicationId() {
    return this.activatedRoute.params.pipe(
      first(),
      map((params) => params?.id)
    );
  }
}
