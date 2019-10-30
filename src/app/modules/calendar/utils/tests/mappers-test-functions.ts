import { CalendarEvent } from 'calendar-utils';
import * as moment from 'moment';
import { Event } from '../../model/event.model';

export function fromCalendarEvent(calendarEvent: CalendarEvent): Event {
  const { id, title, start, end, allDay } = calendarEvent;
  return { id: id.toString(), title, start, end, allDay };
}

export function fromFirebaseEvent(firebaseEvent: any): Event {
  const { id, title, start, end, allDay } = firebaseEvent;

  return {
    id,
    title,
    allDay,
    start: moment(start.seconds * 1000).toDate(),
    end: moment(end.seconds * 1000).toDate()
  };
}

export function fromCalendarEvents(events: CalendarEvent[]): Event[] {
  return events.map(x => fromCalendarEvent(x));
}

export function toCalendarEvent(event: Event): CalendarEvent {
  return {
    id: event.id,
    start: event.start,
    end: event.end,
    allDay: event.allDay,
    title: event.title
  };
}

export function toCalendarEvents(events: Event[]): CalendarEvent[] {
  return events.map(x => toCalendarEvent(x));
}
