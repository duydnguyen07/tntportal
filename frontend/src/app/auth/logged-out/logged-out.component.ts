import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-logged-out',
  templateUrl: './logged-out.component.html',
  styleUrls: ['./logged-out.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoggedOutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
