import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromReducer from 'src/app/modules/calendar/store/reducers/calendar.reducer';

const selectCalendarState = createFeatureSelector<fromReducer.CalendarState>('calendar');

const selectEvents = createSelector(
  selectCalendarState,
  fromReducer.selectAll
);

const selectMonthsLoaded = createSelector(
  selectCalendarState,
  (state: fromReducer.CalendarState) => state.monthsLoaded
);

export const calendarQueries = {
  selectEvents,
  selectMonthsLoaded
};
