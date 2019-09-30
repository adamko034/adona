import { select, Store } from '@ngrx/store';
import { CalendarEvent } from 'calendar-utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { calendarQueries } from 'src/app/modules/calendar/store/selectors/calendar.selectors';
import { CalendarMapper } from '../mappers/calendar.mapper';
import {
  MonthEventsRequestedAction,
  NewEventRequestedAction,
  UpdateEventRequestedAction
} from './actions/calendar.actions';
import { CalendarState } from './reducers/calendar.reducer';

export class CalendarFacade {
  constructor(private store: Store<CalendarState>, private mapper: CalendarMapper) {}

  public get events$(): Observable<CalendarEvent[]> {
    return this.store.pipe(
      select(calendarQueries.selectEvents),
      map((events: Event[]) => this.mapper.CalendarEvent.fromEvents(events))
    );
  }

  public get monthsLoaded$(): Observable<string[]> {
    return this.store.pipe(select(calendarQueries.selectMonthsLoaded));
  }

  public addEvent(event: Event): void {
    this.store.dispatch(new NewEventRequestedAction({ newEvent: event }));
  }

  public updateEvent(event: Event): void {
    this.store.dispatch(new UpdateEventRequestedAction({ event }));
  }

  public loadMonthEvents(date: Date): void {
    this.store.dispatch(new MonthEventsRequestedAction({ date }));
  }
}
