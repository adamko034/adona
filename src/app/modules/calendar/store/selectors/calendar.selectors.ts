import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CalendarState } from 'src/app/modules/calendar/store/reducers/calendar.reducer';

const selectCalendarState = createFeatureSelector<CalendarState>('calendar');
const selectAllEventsLoaded = createSelector(
  selectCalendarState,
  state => state.eventsLoaded
);

export const calendarQueries = {
  selectAllEventsLoaded
};
