import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { LoaderComponent } from './loader/loader.component';
import { ApplicationFormComponent } from './application-form/application-form.component';

@NgModule({
  imports: [FlexLayoutModule, CommonModule, MatProgressSpinnerModule],
  declarations: [LoaderComponent, ApplicationFormComponent],
  exports: [LoaderComponent],
})
export class SharedModule {}
