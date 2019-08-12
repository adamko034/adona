import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
  CalendarActionTypes,
  CalendarActions,
  AllEventsLoadedAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { map, mergeMap, withLatestFrom, filter } from 'rxjs/operators';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarState } from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { calendarQueries } from 'src/app/modules/calendar/store/selectors/calendar.selectors';

@Injectable()
export class CalendarEffects {
  constructor(
    private actions$: Actions,
    private calendarService: CalendarService,
    private store: Store<CalendarState>
  ) {}

  @Effect()
  public allEventsReqeusted$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.AllEventsRequested),
    withLatestFrom(this.store.pipe(select(calendarQueries.selectAllEventsLoaded))),
    filter(([action, eventsLoaded]) => !eventsLoaded),
    mergeMap(() => this.calendarService.getEvents()),
    map((events: Event[]) => new AllEventsLoadedAction({ events }))
  );
}
