import { Injectable } from '@angular/core';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { TimeService } from 'src/app/shared/services/time/time.service';

@Injectable()
export class CalendarCustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(private timeService: TimeService) {
    super();
  }

  public month(event: CalendarEvent, title: string): string {
    if (event.allDay) {
      return `(all day) ${title}`;
    }

    if (this.timeService.Comparison.areDatesTheSame(event.start, event.end)) {
      return `(${this.timeService.Extraction.getTimeString(event.start)} - ${this.timeService.Extraction.getTimeString(
        event.end
      )}) ${title}`;
    }

    return `(${this.timeService.Extraction.getDateTimeString(
      event.start
    )} - ${this.timeService.Extraction.getDateTimeString(event.end)}) ${title}`;
  }
}
