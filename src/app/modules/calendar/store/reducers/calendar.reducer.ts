import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { CalendarView } from 'angular-calendar';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { AdonaCalendarView } from '../../model/adona-calendar-view.model';

export interface TeamEventsState extends EntityState<Event> {
  monthsLoaded: Date[];
}

const adapter: EntityAdapter<Event> = createEntityAdapter<Event>();
const teamEventsInitialState = adapter.getInitialState({
  monthsLoaded: []
});

export interface CalendarState {
  teams: { [teamId: string]: TeamEventsState };
  view: AdonaCalendarView;
  viewDate: Date;
}

export const initialCalendarState: CalendarState = {
  teams: {},
  view: { isList: false, calendarView: CalendarView.Month },
  viewDate: new Date()
};

const calendarReducer = createReducer(
  initialCalendarState,
  on(calendarActions.event.addEventSuccess, (state, { event }) => {
    const teamEventsState = getTeamEventsState(state, event.teamId);
    return { ...state, teams: { ...state.teams, [event.teamId]: adapter.addOne(event, teamEventsState) } };
  }),
  on(calendarActions.event.updateEventSuccess, (state, { eventUpdate }) => {
    const teamEventsState = getTeamEventsState(state, eventUpdate.changes.teamId);
    return {
      ...state,
      teams: { ...state.teams, [eventUpdate.changes.teamId]: adapter.updateOne(eventUpdate, teamEventsState) }
    };
  }),
  on(calendarActions.event.deleteEventSuccess, (state, { teamId, id }) => {
    const teamEventsState = getTeamEventsState(state, teamId);
    return { ...state, teams: { ...state.teams, [teamId]: adapter.removeOne(id, teamEventsState) } };
  }),
  on(calendarActions.events.loadMonthEventsSuccess, (state, { events, date, teamId }) => {
    const newTeamEventsState: TeamEventsState = !!state.teams[teamId]
      ? { ...state.teams[teamId], monthsLoaded: [...state.teams[teamId].monthsLoaded, date] }
      : { monthsLoaded: [date], ids: [], entities: {} };
    return { ...state, teams: { ...state.teams, [teamId]: adapter.addMany(events, newTeamEventsState) } };
  }),
  on(calendarActions.ui.viewChange, (state, action) => ({ ...state, view: action.view })),
  on(calendarActions.ui.viewDateChange, (state, action) => ({ ...state, viewDate: action.date }))
);

function getTeamEventsState(state: CalendarState, teamId: string) {
  return !!state.teams[teamId] ? { ...state.teams[teamId] } : teamEventsInitialState;
}

export function reducer(state: CalendarState | undefined, action) {
  return calendarReducer(state, action);
}

export const { selectAll, selectEntities, selectIds } = adapter.getSelectors();
