import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { CalendarView } from 'angular-calendar';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { AdonaCalendarView } from '../../model/adona-calendar-view.model';

export interface CalendarState extends EntityState<Event> {
  monthsLoaded: Date[];
  view: AdonaCalendarView;
  viewDate: Date;
}

export const calendarFeatureKey = 'calendar';
export const adapter: EntityAdapter<Event> = createEntityAdapter<Event>();

export const initialCalendarState: CalendarState = adapter.getInitialState({
  monthsLoaded: [],
  view: { isList: false, calendarView: CalendarView.Month },
  viewDate: new Date()
});

const calendarReducer = createReducer(
  initialCalendarState,
  on(calendarActions.event.addEventSuccess, (state, action) => adapter.addOne(action.event, { ...state })),
  on(calendarActions.event.updateEventSuccess, (state, action) => adapter.updateOne(action.eventUpdate, { ...state })),
  on(calendarActions.event.deleteEventSuccess, (state, action) => adapter.removeOne(action.id, { ...state })),
  on(calendarActions.events.loadMonthEventsSuccess, (state, action) => {
    const newMonthsLoaded = [...state.monthsLoaded, action.date];
    const newState = { ...state, monthsLoaded: newMonthsLoaded };

    return adapter.addMany(action.events, newState);
  }),
  on(calendarActions.ui.viewChange, (state, action) => ({ ...state, view: action.view })),
  on(calendarActions.ui.viewDateChange, (state, action) => ({ ...state, viewDate: action.date }))
);

export function reducer(state: CalendarState | undefined, action) {
  return calendarReducer(state, action);
}

export const { selectAll, selectEntities, selectIds } = adapter.getSelectors();
