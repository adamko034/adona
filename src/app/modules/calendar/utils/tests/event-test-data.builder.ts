import { CalendarEvent } from 'calendar-utils';
import * as moment from 'moment';
import { Event } from 'src/app/modules/calendar/model/event.model';

export class EventsTestDataBuilder {
  private events: Event[] = [];

  public addOneWithDefaultData(): EventsTestDataBuilder {
    this.events.push({
      id: this.events.length.toString(),
      title: 'Test Event' + this.events.length.toString(),
      start: new Date(),
      end: moment()
        .add(1, 'h')
        .toDate(),
      allDay: false
    });

    return this;
  }

  public buildEvent(): Event[] {
    return this.events;
  }

  public buildCalendarEvents(): CalendarEvent[] {
    return this.events.map(({ id, title, start, end, allDay }) => {
      return { id, title, start, end, allDay };
    });
  }
}
