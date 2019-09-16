import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { TimeService } from 'src/app/shared/services/time/time.service';

export class CalendarCustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(private timeService: TimeService) {
    super();
  }

  public month(event: CalendarEvent, title: string): string {
    return `${this.timeService.Extraction.getTimeString(event.start)} - ${this.timeService.Extraction.getTimeString(
      event.end
    )} ${title}`;
  }
}
