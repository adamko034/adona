import { CalendarEvent } from 'calendar-utils';

export interface EventsGroupedByStartDate {
  id: string;
  start: Date;
  events: CalendarEvent[];
}
