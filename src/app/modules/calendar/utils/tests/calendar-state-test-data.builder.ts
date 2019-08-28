import { CalendarState } from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { Event } from 'src/app/modules/calendar/model/event.model';

export class CalendarStateTestDataBuilder {
  public fromEvents(events: Event[], loaded: boolean = false): CalendarState {
    const calendarState: CalendarState = {
      ids: events.map(event => event.id),
      entities: {},
      eventsLoaded: loaded
    };

    return events.reduce((state, item) => {
      state.entities[Number.parseInt(item.id, 10)] = item;
      return state;
    }, calendarState);
  }
}
