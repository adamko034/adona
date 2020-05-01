import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromReducer from 'src/app/modules/calendar/store/reducers/calendar.reducer';

const selectCalendarState = createFeatureSelector<fromReducer.CalendarState>('calendar');
const selectTeamEventsState = createSelector(
  selectCalendarState,
  (state: fromReducer.CalendarState, { teamId }) => state.teams[teamId] || { ids: [], entities: {}, monthsLoaded: [] }
);
const selectEvents = createSelector(selectTeamEventsState, (state: fromReducer.TeamEventsState) =>
  fromReducer.selectAll(state)
);

const selectMonthsLoaded = createSelector(
  selectTeamEventsState,
  (state: fromReducer.TeamEventsState) => state.monthsLoaded || []
);

const selectView = createSelector(selectCalendarState, (state: fromReducer.CalendarState) => state.view);
const selectViewDate = createSelector(selectCalendarState, (state: fromReducer.CalendarState) => state.viewDate);

export const calendarQueries = {
  selectEvents,
  selectMonthsLoaded,
  selectView,
  selectViewDate
};
