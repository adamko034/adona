import { CalendarEvent } from 'calendar-utils';
import { Event } from '../../model/event.model';

export class CalendarEventMapper {
  public fromEvent(event: Event): CalendarEvent {
    const { id, title, start, end, allDay } = event;

    return {
      id,
      title,
      start,
      end,
      allDay
    };
  }

  public fromEvents(events: Event[]): CalendarEvent[] {
    return events.map(event => this.fromEvent(event));
  }
}
