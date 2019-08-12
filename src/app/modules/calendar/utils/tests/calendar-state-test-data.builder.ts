import { CalendarState } from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { Event } from 'src/app/modules/calendar/model/event.model';

export class CalendarStateTestDataBuilder {
  public fromEvents(events: Event[]): CalendarState {
    const ids: string[] = events.map(event => event.id);
  }
}
