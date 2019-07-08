import { Component, Input, OnInit } from '@angular/core';
import { CalendarDateFormatter, CalendarView } from 'angular-calendar';
import { CalendarHourFormatter } from '../../utils/calendar-hour-formatter';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CalendarHourFormatter
    }
  ]
})
export class CalendarViewComponent implements OnInit {
  @Input() viewDate: Date;
  @Input() view: CalendarView;
  @Input() weekStartsOn: number;

  activeDayIsOpen = false;
  CalendarView = CalendarView;

  constructor() {}

  ngOnInit() {}
}
