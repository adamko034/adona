import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CalendarDateFormatter, CalendarEvent, CalendarEventTitleFormatter, CalendarView } from 'angular-calendar';
import * as _ from 'lodash';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view/adona-calendar-view.model';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { CalendarFacade } from '../../store/calendar.facade';
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
export class CalendarViewComponent implements OnChanges {
  @Input() viewDate: Date;
  @Input() view: AdonaCalendarView;
  @Input() events: CalendarEvent[];

  @Output() eventClicked = new EventEmitter<CalendarEvent>();

  public activeDayIsOpen = false;
  public CalendarView = CalendarView;

  constructor(private timeService: TimeService, private calendarFacade: CalendarFacade) {}

  public ngOnChanges() {
    this.activeDayIsOpen = this.eventExistsOnViewDate();
  }

  public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }) {
    if (this.timeService.Comparison.areInTheSameMonth(this.viewDate, date)) {
      let showActiveDay = true;

      if (
        (this.timeService.Comparison.areDatesTheSame(this.viewDate, date) && this.activeDayIsOpen) ||
        events.length === 0
      ) {
        showActiveDay = false;
      }

      this.activeDayIsOpen = showActiveDay;
    }

    if (!this.timeService.Comparison.areDatesTheSame(date, this.viewDate)) {
      this.calendarFacade.changeViewDate(date);
    }
  }

  public onEventClicked(event: CalendarEvent) {
    this.eventClicked.emit(event);
  }

  private eventExistsOnViewDate(): boolean {
    return (
      _.findIndex(this.events, (x: CalendarEvent) =>
        this.timeService.Comparison.isDateBetweenDates(this.viewDate, x.start, x.end)
      ) >= 0
    );
  }
}
