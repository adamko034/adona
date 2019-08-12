import {
  CalendarActions,
  CalendarActionTypes
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

export interface CalendarState extends EntityState<Event> {
  eventsLoaded: boolean;
}

export const adapter: EntityAdapter<Event> = createEntityAdapter<Event>();

export const initialCalendarState: CalendarState = adapter.getInitialState({
  eventsLoaded: false
});

export function calendarReducer(
  state = initialCalendarState,
  action: CalendarActions
): CalendarState {
  switch (action.type) {
    case CalendarActionTypes.AllEventsLoaded:
      return adapter.addAll(action.payload.events, { ...state, eventsLoaded: true });
    default:
      return state;
  }
}
