import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarActions, CalendarActionTypes } from 'src/app/modules/calendar/store/actions/calendar.actions';

export interface CalendarState extends EntityState<Event> {
  monthsLoaded: string[];
}

export const adapter: EntityAdapter<Event> = createEntityAdapter<Event>();

export const initialCalendarState: CalendarState = adapter.getInitialState({
  monthsLoaded: []
});

export function calendarReducer(state = initialCalendarState, action: CalendarActions): CalendarState {
  switch (action.type) {
    case CalendarActionTypes.EventsLoaded:
      const newMonthsLoaded = [...state.monthsLoaded, action.payload.yearMonth];
      const newState = { ...state, monthsLoaded: newMonthsLoaded };

      return adapter.addMany(action.payload.events, newState);
    case CalendarActionTypes.NewEventAdded:
      return adapter.addOne(action.payload.event, { ...state });
    case CalendarActionTypes.EventUpdated:
      return adapter.updateOne(action.payload.eventUpdate, { ...state });
    case CalendarActionTypes.EventDeleteSuccess:
      return adapter.removeOne(action.payload.id, { ...state });
    default:
      return state;
  }
}

export const { selectAll, selectEntities, selectIds } = adapter.getSelectors();
