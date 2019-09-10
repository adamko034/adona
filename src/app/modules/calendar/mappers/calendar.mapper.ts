import { Injectable } from '@angular/core';
import { CalendarEventMapper } from './event/calendar-event.mapper';
import { EventMapper } from './event/event.mapper';

@Injectable()
export class CalendarMapper {
  private calendarEventMapper: CalendarEventMapper;
  private eventMapper: EventMapper;

  public get CalendarEvent(): CalendarEventMapper {
    return this.calendarEventMapper;
  }

  public get Event(): EventMapper {
    return this.eventMapper;
  }

  constructor() {
    this.eventMapper = new EventMapper();
    this.calendarEventMapper = new CalendarEventMapper();
  }
}
