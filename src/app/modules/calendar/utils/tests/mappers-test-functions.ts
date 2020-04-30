import { CalendarEvent } from 'calendar-utils';
import * as moment from 'moment';
import { Event } from '../../model/event.model';

export function fromCalendarEvent(calendarEvent: CalendarEvent): Event {
  const { id, title, start, end, allDay } = calendarEvent;
  return {
    id: id.toString(),
    title,
    start,
    end,
    allDay,
    createdBy: 'user',
    created: new Date(),
    teamId: '123',
    createdById: 'user1'
  };
}

export function fromFirebaseEvent(firebaseEvent: any): Event {
  const { id, title, start, end, allDay, created, createdBy, createdById, teamId } = firebaseEvent;

  return {
    id,
    title,
    allDay,
    start: moment(start.seconds * 1000).toDate(),
    end: moment(end.seconds * 1000).toDate(),
    created: moment(created.seconds * 1000).toDate(),
    createdBy,
    createdById,
    teamId
  };
}

export function fromCalendarEvents(events: CalendarEvent[]): Event[] {
  return events.map((x) => fromCalendarEvent(x));
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
  return events.map((x) => toCalendarEvent(x));
}
