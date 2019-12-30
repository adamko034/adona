import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromReducer from 'src/app/modules/calendar/store/reducers/calendar.reducer';

const selectCalendarState = createFeatureSelector<fromReducer.CalendarState>('calendar');

const selectEvents = createSelector(selectCalendarState, fromReducer.selectAll);

const selectMonthsLoaded = createSelector(
  selectCalendarState,
  (state: fromReducer.CalendarState) => state.monthsLoaded
);

const selectView = createSelector(selectCalendarState, (state: fromReducer.CalendarState) => state.view);

const selectViewDate = createSelector(selectCalendarState, (state: fromReducer.CalendarState) => state.viewDate);

export const calendarQueries = {
  selectEvents,
  selectMonthsLoaded,
  selectView,
  selectViewDate
};
