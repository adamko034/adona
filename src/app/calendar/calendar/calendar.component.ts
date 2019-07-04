import { Component, OnInit } from '@angular/core';
import {
  CalendarDateFormatter,
  CalendarView,
  DAYS_OF_WEEK
} from 'angular-calendar';
import { CalendarHourFormatter } from '../shared/calendar-hour-formatter';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CalendarHourFormatter
    }
  ]
})
export class CalendarComponent implements OnInit {
  viewDate: Date = new Date();
  activeDayIsOpen = false;
  weekStartsOn = DAYS_OF_WEEK.MONDAY;
  view = CalendarView.Month;
  CalendarView = CalendarView;

  constructor() {}

  ngOnInit() {}

  setView(newView: CalendarView) {
    this.view = newView;
  }
}
