import { Injectable } from '@angular/core';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { TimeService } from 'src/app/shared/services/time/time.service';

@Injectable()
export class CalendarCustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(private timeService: TimeService) {
    super();
  }

  public month(event: CalendarEvent, title: string): string {
    if (this.timeService.Comparison.areDatesTheSame(event.start, event.end)) {
      if (event.allDay) {
        return `(all day) ${title}`;
      }

      return `(${this.timeService.Extraction.getTimeString(event.start)} - ${this.timeService.Extraction.getTimeString(
        event.end
      )}) ${title}`;
    }

    if (event.allDay) {
      return `(${this.timeService.Extraction.getDateString(event.start)} - ${this.timeService.Extraction.getDateString(
        event.end
      )}) ${title}`;
    }

    return `(${this.timeService.Extraction.getDateTimeString(
      event.start
    )} - ${this.timeService.Extraction.getDateTimeString(event.end)}) ${title}`;
  }
}
