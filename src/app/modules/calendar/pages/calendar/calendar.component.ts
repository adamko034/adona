import { Component, OnInit } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  view = CalendarView.Month;
  viewDate = new Date();

  constructor() {}

  ngOnInit() {}

  onViewChanged(newView: CalendarView) {
    this.view = newView;
  }
}
