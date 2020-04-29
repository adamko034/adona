import { CalendarView } from 'angular-calendar';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarState } from 'src/app/modules/calendar/store/reducers/calendar.reducer';

export class CalendarStateTestDataBuilder {
  private state: CalendarState;

  private constructor() {
    this.state = {
      monthsLoaded: [],
      ids: [],
      entities: {},
      view: { isList: false, calendarView: CalendarView.Month },
      viewDate: new Date()
    };
  }

  public static fromDefaults(): CalendarStateTestDataBuilder {
    return new CalendarStateTestDataBuilder();
  }

  public withEvents(events: Event[]): CalendarStateTestDataBuilder {
    const newState: CalendarState = { ...this.state, ids: events.map((event) => event.id), entities: {} };

    this.state = events.reduce((state, item) => {
      state.entities[Number.parseInt(item.id, 10)] = item;
      return state;
    }, newState);

    return this;
  }

  public withMonthsLoaded(monthsLoaded: Date[]): CalendarStateTestDataBuilder {
    this.state.monthsLoaded = [...monthsLoaded];

    return this;
  }

  public build(): CalendarState {
    return this.state;
  }
}
