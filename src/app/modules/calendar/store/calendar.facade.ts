import { select, Store } from '@ngrx/store';
import { CalendarEvent } from 'calendar-utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { calendarQueries } from 'src/app/modules/calendar/store/selectors/calendar.selectors';
import { CalendarMapper } from '../mappers/calendar.mapper';
import { NewEventRequest } from '../model/new-event-request.model';
import { MonthEventsRequestedAction, NewEventRequestedAction } from './actions/calendar.actions';
import { CalendarState } from './reducers/calendar.reducer';

export class CalendarFacade {
  constructor(private store: Store<CalendarState>, private mapper: CalendarMapper) {}

  public get events$(): Observable<CalendarEvent[]> {
    return this.store.pipe(
      select(calendarQueries.selectEvents),
      map((events: Event[]) => this.mapper.CalendarEvent.fromEvents(events))
    );
  }

  public addEvent(event: NewEventRequest): void {
    this.store.dispatch(new NewEventRequestedAction({ newEvent: event }));
  }

  public loadMonthEvents(date: Date): void {
    this.store.dispatch(new MonthEventsRequestedAction({ date }));
  }
}
