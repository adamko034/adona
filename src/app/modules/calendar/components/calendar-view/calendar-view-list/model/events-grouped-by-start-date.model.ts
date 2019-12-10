import { CalendarEvent } from 'calendar-utils';

export interface EventsGroupedByStartDate {
  timestamp: number;
  start: Date;
  events: CalendarEvent[];
}
