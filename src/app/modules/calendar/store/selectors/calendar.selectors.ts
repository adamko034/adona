import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromReducer from 'src/app/modules/calendar/store/reducers/calendar.reducer';

const selectCalendarState = createFeatureSelector<fromReducer.CalendarState>('calendar');
const selectAllEventsLoaded = createSelector(
  selectCalendarState,
  state => state.eventsLoaded
);

const selectEvents = createSelector(
  selectCalendarState,
  fromReducer.selectAll
);

export const calendarQueries = {
  selectAllEventsLoaded,
  selectEvents
};
