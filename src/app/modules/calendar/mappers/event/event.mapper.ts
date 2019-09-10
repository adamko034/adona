import { CalendarEvent } from 'calendar-utils';
import { Event } from '../../model/event.model';

export class EventMapper {
  public fromCalendarEvent(calendarEvent: CalendarEvent): Event {
    const { id, title, start, end, allDay } = calendarEvent;

    return { id: id.toString(), title, start, end, allDay };
  }
}
