import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CalendarEvent } from 'calendar-utils';
import * as lodash from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { calendarQueries } from 'src/app/modules/calendar/store/selectors/calendar.selectors';
import { CalendarMapper } from '../mappers/calendar.mapper';
import { AdonaCalendarView } from '../model/adona-calendar-view.model';
import {
  CalendarViewChangedAction,
  CalendarViewDateChangedAction,
  EventDeleteRequestedAction,
  MonthEventsRequestedAction,
  NewEventRequestedAction,
  UpdateEventRequestedAction
} from './actions/calendar.actions';
import { CalendarState } from './reducers/calendar.reducer';

@Injectable()
export class CalendarFacade {
  constructor(private store: Store<CalendarState>, private mapper: CalendarMapper) {}

  public selectEvents(): Observable<CalendarEvent[]> {
    return this.store.pipe(
      select(calendarQueries.selectEvents),
      map((events: Event[]) => this.mapper.CalendarEvent.fromEvents(events)),
      map(events => lodash.sortBy(events, ['start', 'end', 'title']))
    );
  }

  public selectView(): Observable<AdonaCalendarView> {
    return this.store.pipe(select(calendarQueries.selectView));
  }

  public selectViewDate(): Observable<Date> {
    return this.store.pipe(select(calendarQueries.selectViewDate));
  }

  public selectMonthsLoaded(): Observable<string[]> {
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

  public deleteEvent(event: Event) {
    this.store.dispatch(new EventDeleteRequestedAction({ id: event.id }));
  }

  public changeViewDate(newDate: Date) {
    this.store.dispatch(new CalendarViewDateChangedAction({ newDate }));
  }

  public changeView(newView: AdonaCalendarView) {
    this.store.dispatch(new CalendarViewChangedAction({ newView }));
  }
}
