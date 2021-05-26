import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '@shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  imports: [
    CommonModule, 
    TranslateModule, 
    SharedModule, 
    FlexLayoutModule, 
    HomeRoutingModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
