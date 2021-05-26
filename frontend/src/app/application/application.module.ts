import { ViewApplicationComponent } from './view-application/view-application.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from './../@shared/shared.module';
import { ApplicationRoutingModule } from './application-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewApplicationComponent } from './new-application/new-application.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { EditApplicationComponent } from './edit-application/edit-application.component';

@NgModule({
  declarations: [
    ViewApplicationComponent, 
    NewApplicationComponent, 
    SuccessDialogComponent, EditApplicationComponent,
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class ApplicationModule { }
