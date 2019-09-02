import { Store, select } from '@ngrx/store';
import { AllEventsRequestedAction } from './actions/calendar.actions';
import { CalendarState } from './reducers/calendar.reducer';
import { Observable } from 'rxjs';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { calendarQueries } from 'src/app/modules/calendar/store/selectors/calendar.selectors';
import { CalendarEvent } from 'calendar-utils';
import { map } from 'rxjs/operators';
import { CalendarMapper } from 'src/app/modules/calendar/mappers/event.mapper';

export class CalendarFacade {
  constructor(private store: Store<CalendarState>, private mapper: CalendarMapper) {}

  public get events$(): Observable<CalendarEvent[]> {
    return this.store.pipe(
      select(calendarQueries.selectEvents),
      map((events: Event[]) => this.mapper.toCalendarEvents(events))
    );
  }

  public addEvent(event: Event): void {
    this.store.dispatch(new AddEventAction(event));
  }

  public loadAllEvents(): void {
    this.store.dispatch(new AllEventsRequestedAction());
  }
}
