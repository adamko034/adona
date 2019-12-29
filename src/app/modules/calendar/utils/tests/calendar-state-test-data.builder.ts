import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarState } from 'src/app/modules/calendar/store/reducers/calendar.reducer';

export class CalendarStateTestDataBuilder {
  private state: CalendarState;

  constructor() {
    this.state = { monthsLoaded: [], ids: [], entities: {} };
  }

  public withEvents(events: Event[]): CalendarStateTestDataBuilder {
    const newState: CalendarState = {
      ids: events.map(event => event.id),
      entities: {},
      monthsLoaded: []
    };

    this.state = events.reduce((state, item) => {
      state.entities[Number.parseInt(item.id, 10)] = item;
      return state;
    }, newState);

    return this;
  }

  public withMonthsLoaded(monthsLoaded: string[]): CalendarStateTestDataBuilder {
    this.state.monthsLoaded = [...monthsLoaded];

    return this;
  }

  public build(): CalendarState {
    return this.state;
  }
}
