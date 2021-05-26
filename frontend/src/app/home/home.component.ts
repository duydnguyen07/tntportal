import { HttpErrorResponse } from '@angular/common/http';
import { FormConfig } from '@app/@shared/application-form/application-form.model';
import { ApplicationService } from '@core/application-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import { QuoteService } from './quote.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;

  // dataSource$: BehaviorSubject<FormConfig[]> = new BehaviorSubject([]);
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private applicationService: ApplicationService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.displayedColumns = ['CustomerInformation.FirstName', 'created_at', 'action'];

    this.applicationService.getAllNew().subscribe(
      (applications: FormConfig[]) => {
        if(!applications) throw Error('Applications object is falsy.')
        this.dataSource.data = this.flattenArray(applications)
      }),
      (err: HttpErrorResponse) => {
        console.log(err)
      }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  private flat(obj: Object, concatenator = '.'): Object {
    if(!obj) return {};

    return Object.keys(obj).reduce(
      (acc, key) => {
        if (typeof obj[key] !== 'object') {
          return {
            ...acc,
            [key]: obj[key],
          };
        }
  
        const flattenedChild = this.flat(obj[key], concatenator);
  
        return {
          ...acc,
          ...Object.keys(flattenedChild).reduce((childAcc, childKey) => (
            { ...childAcc, [`${key}${concatenator}${childKey}`]: flattenedChild[childKey] }), {}
          ),
        };
      },
      {},
    );
  }

  private flattenArray(arr: Object[]) {
    return arr.map(o => this.flat(o))
  }
  
}
