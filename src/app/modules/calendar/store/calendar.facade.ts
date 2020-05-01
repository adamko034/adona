import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CalendarEvent } from 'calendar-utils';
import * as lodash from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { calendarQueries } from 'src/app/modules/calendar/store/selectors/calendar.selectors';
import { CalendarMapper } from '../mappers/calendar.mapper';
import { AdonaCalendarView } from '../model/adona-calendar-view.model';
import { CalendarState } from './reducers/calendar.reducer';

@Injectable()
export class CalendarFacade {
  constructor(private store: Store<CalendarState>, private mapper: CalendarMapper) {}

  public selectEvents(teamId: string): Observable<CalendarEvent[]> {
    return this.store.pipe(
      select(calendarQueries.selectEvents, { teamId }),
      map((events: Event[]) => this.mapper.CalendarEvent.fromEvents(events)),
      map((events) => lodash.sortBy(events, ['start', 'end', 'title']))
    );
  }

  public selectView(): Observable<AdonaCalendarView> {
    return this.store.pipe(select(calendarQueries.selectView));
  }

  public selectViewDate(): Observable<Date> {
    return this.store.pipe(select(calendarQueries.selectViewDate));
  }

  public selectMonthsLoaded(teamId: string): Observable<Date[]> {
    return this.store.pipe(select(calendarQueries.selectMonthsLoaded, { teamId }));
  }

  public addEvent(event: Event): void {
    this.store.dispatch(calendarActions.event.addEventRequest({ event }));
  }

  public updateEvent(event: Event): void {
    this.store.dispatch(calendarActions.event.updateEventRequest({ event }));
  }

  public loadMonthEvents(date: Date, teamId: string): void {
    this.store.dispatch(calendarActions.events.loadMonthEventsRequest({ date, teamId }));
  }

  public deleteEvent(event: Event) {
    this.store.dispatch(calendarActions.event.deleteEventRequest({ event }));
  }

  public changeViewDate(newDate: Date) {
    this.store.dispatch(calendarActions.ui.viewDateChange({ date: newDate }));
  }

  public changeView(newView: AdonaCalendarView) {
    this.store.dispatch(calendarActions.ui.viewChange({ view: newView }));
  }
}
