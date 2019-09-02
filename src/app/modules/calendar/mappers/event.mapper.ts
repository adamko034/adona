import { Injectable } from '@angular/core';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarEvent } from 'calendar-utils';

@Injectable()
export class CalendarMapper {
  public toCalendarEvent(event: Event): CalendarEvent {
    const { id, title, start, end } = event;

    return {
      id,
      title,
      start,
      end
    };
  }

  public toEvent(calendarEvent: CalendarEvent): Event {
    const { id, title, start, end } = calendarEvent;

    return { id: id.toString(), title, start, end };
  }

  public toCalendarEvents(events: Event[]): CalendarEvent[] {
    return events.map(event => this.toCalendarEvent(event));
  }
}
