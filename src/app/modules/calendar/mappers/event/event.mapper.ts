import { CalendarEvent } from 'calendar-utils';
import { Event } from '../../model/event.model';
import { NewEventRequest } from 'src/app/modules/calendar/model/new-event-request.model';

export class EventMapper {
  public fromCalendarEvent(calendarEvent: CalendarEvent): Event {
    const { id, title, start, end, allDay } = calendarEvent;

    return { id: id.toString(), title, start, end, allDay };
  }

  public fromNewEventRequest(newEvent: NewEventRequest, newId: string): Event {
    return {
      id: newId,
      start: newEvent.startDate,
      end: newEvent.endDate,
      allDay: newEvent.allDay,
      title: newEvent.title
    };
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
