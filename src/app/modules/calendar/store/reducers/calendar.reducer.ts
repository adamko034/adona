import {
  CalendarActions,
  CalendarActionTypes
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

export interface CalendarState extends EntityState<Event> {}

export const adapter: EntityAdapter<Event> = createEntityAdapter<Event>();

export const initialCalendarState: CalendarState = adapter.getInitialState();

export function calendarReducer(
  state = initialCalendarState,
  action: CalendarActions
): CalendarState {
  switch (action.type) {
    case CalendarActionTypes.AllEventsLoaded:
      return adapter.addAll(action.payload.events, { ...state });
    default:
      return state;
  }
}
