import { CalendarEvent } from 'calendar-utils';
import { Event } from '../../model/event.model';

export class EventMapper {
  public fromCalendarEvent(calendarEvent: CalendarEvent): Event {
    const { id, title, start, end, allDay } = calendarEvent;

    return { id: id.toString(), title, start, end, allDay };
  }

  public fromFirebaseEvent(event: any): Event {
    return {
      id: event.id,
      allDay: event.allDay,
      end: new Date(event.end.seconds * 1000),
      start: new Date(event.start.seconds * 1000),
      title: event.title
    };
  }

  public fromFirebaseEvents(events: any[]): Event[] {
    return events.map(event => {
      return this.fromFirebaseEvent(event);
    });
  }
}
