import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Event } from 'src/app/modules/calendar/model/event.model';
import {
  CalendarActions,
  CalendarActionTypes
} from 'src/app/modules/calendar/store/actions/calendar.actions';

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
  console.log(action.type);
  switch (action.type) {
    case CalendarActionTypes.AllEventsLoaded:
      console.log('evnets loaded', action.payload.events);
      return adapter.addAll(action.payload.events, { ...state, eventsLoaded: true });
    case CalendarActionTypes.NewEventAdded:
      console.log('addint to adapter');
      return adapter.addOne(action.payload.event, { ...state });
    default:
      return state;
  }
}

export const { selectAll, selectEntities, selectIds } = adapter.getSelectors();
