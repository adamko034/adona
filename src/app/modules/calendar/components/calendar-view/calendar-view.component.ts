import { Component, Input, OnInit } from '@angular/core';
import { CalendarDateFormatter, CalendarEvent, CalendarView } from 'angular-calendar';
import { CalendarFacade } from '../../store/calendar.facade';
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
  @Input() events: CalendarEvent[];

  public activeDayIsOpen = true;
  CalendarView = CalendarView;

  constructor(private calendarFacade: CalendarFacade) {}

  ngOnInit() {}
}
