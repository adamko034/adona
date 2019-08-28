import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
  CalendarActionTypes,
  CalendarActions,
  AllEventsLoadedAction,
  EventsLoadedErrorAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { map, mergeMap, withLatestFrom, filter, catchError, tap, mapTo } from 'rxjs/operators';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarState } from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { calendarQueries } from 'src/app/modules/calendar/store/selectors/calendar.selectors';
import { ErrorActions, ErrorOccuredAction } from 'src/app/core/store/actions/error.actions';
import { errors } from 'src/app/shared/constants/errors.constants';

@Injectable()
export class CalendarEffects {
  constructor(
    private actions$: Actions,
    private calendarService: CalendarService,
    private store: Store<CalendarState>
  ) {}

  @Effect()
  public allEventsRequested$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.AllEventsRequested),
    withLatestFrom(this.store.pipe(select(calendarQueries.selectAllEventsLoaded))),
    filter(([action, eventsLoaded]) => !eventsLoaded),
    mergeMap(() => this.calendarService.getEvents()),
    map((events: Event[]) => new AllEventsLoadedAction({ events })),
    catchError(() => of(new EventsLoadedErrorAction()))
  );

  @Effect()
  public eventsLoadedError$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.EventsLoadedError),
    map((action: EventsLoadedErrorAction) =>
      action.payload ? action.payload.error : errors.DEFAULT_API_ERROR_MESSAGE
    ),
    map((message: string) => new ErrorOccuredAction({ message }))
  );
}
