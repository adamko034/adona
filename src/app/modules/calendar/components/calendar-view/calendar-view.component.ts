import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CalendarDateFormatter, CalendarEvent, CalendarEventTitleFormatter, CalendarView } from 'angular-calendar';
import * as _ from 'lodash';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { CalendarCustomEventTitleFormatter } from '../../utils/calendar-custom-event-title-formatter';
import { CalendarHourFormatter } from '../../utils/calendar-hour-formatter';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CalendarHourFormatter
    },
    {
      provide: CalendarEventTitleFormatter,
      useClass: CalendarCustomEventTitleFormatter
    }
  ]
})
export class CalendarViewComponent implements OnInit, OnChanges {
  @Input() viewDate: Date;
  @Input() view: CalendarView;
  @Input() weekStartsOn: number;
  @Input() events: CalendarEvent[];

  public activeDayIsOpen = true;
  public CalendarView = CalendarView;

  constructor(private timeService: TimeService) {}

  ngOnInit() {}

  ngOnChanges(): void {
    this.activeDayIsOpen =
      _.findIndex(this.events, (x: CalendarEvent) =>
        this.timeService.Comparison.areDatesTheSame(this.viewDate, x.start)
      ) >= 0;
  }

  public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (this.timeService.Comparison.areInTheSameMonth(this.viewDate, date)) {
      let showActiveDay = true;

      if (
        (this.timeService.Comparison.areDatesTheSame(this.viewDate, date) && this.activeDayIsOpen) ||
        events.length === 0
      ) {
        showActiveDay = false;
      }

      this.activeDayIsOpen = showActiveDay;
      this.viewDate = date;
    }
  }
}
