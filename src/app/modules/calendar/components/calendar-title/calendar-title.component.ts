import { Component, Input, OnInit } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view.model';

@Component({
  selector: 'app-celendar-title',
  templateUrl: './calendar-title.component.html',
  styleUrls: ['./calendar-title.component.scss']
})
export class CalendarTitleComponent implements OnInit {
  @Input() viewDate: Date = new Date();
  @Input() view: AdonaCalendarView;

  constructor() {}

  ngOnInit() {}

  public getCalendarView(): CalendarView {
    if (this.view && !this.view.isList) {
      return this.view.calendarView;
    }

    return CalendarView.Month;
  }
}
