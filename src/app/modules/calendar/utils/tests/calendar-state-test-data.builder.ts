import { CalendarView } from 'angular-calendar';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarState, TeamEventsState } from 'src/app/modules/calendar/store/reducers/calendar.reducer';

export class CalendarStateTestDataBuilder {
  private state: CalendarState;

  private constructor() {
    this.state = {
      teams: {},
      view: { isList: false, calendarView: CalendarView.Month },
      viewDate: new Date()
    };
  }

  public static fromDefaults(): CalendarStateTestDataBuilder {
    return new CalendarStateTestDataBuilder();
  }

  public withEvents(events: Event[], teamId: string): CalendarStateTestDataBuilder {
    let teamEvents: TeamEventsState = !!this.state.teams[teamId]
      ? { ...this.state.teams[teamId], ids: events.map((event) => event.id), entities: {} }
      : { monthsLoaded: [], ids: events.map((event) => event.id), entities: {} };

    teamEvents = events.reduce((state, item) => {
      state.entities[Number.parseInt(item.id, 10)] = item;
      return state;
    }, teamEvents);

    this.state = { ...this.state, teams: { ...this.state.teams, [teamId]: teamEvents } };

    return this;
  }

  public withMonthsLoaded(monthsLoaded: Date[], teamId: string): CalendarStateTestDataBuilder {
    if (this.state.teams[teamId]) {
      this.state.teams[teamId] = { ...this.state.teams[teamId], monthsLoaded };
    } else {
      this.state.teams[teamId] = { monthsLoaded, ids: [], entities: {} };
    }

    return this;
  }

  public build(): CalendarState {
    return this.state;
  }
}
