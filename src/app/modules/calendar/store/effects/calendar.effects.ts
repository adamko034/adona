import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ErrorOccuredAction } from 'src/app/core/store/actions/error.actions';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import {
  AddEventAction,
  AllEventsLoadedAction,
  CalendarActions,
  CalendarActionTypes,
  EventCreationErrorAction,
  EventsLoadedErrorAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { CalendarState } from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { calendarQueries } from 'src/app/modules/calendar/store/selectors/calendar.selectors';
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
      action.payload ? action.payload.error : errors.DEFAULT_API_GET_ERROR_MESSAGE
    ),
    map((message: string) => new ErrorOccuredAction({ message }))
  );

  @Effect()
  public eventCreationError$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.EventCreationError),
    map((action: EventCreationErrorAction) =>
      action.payload ? action.payload.error : errors.DEFAULT_API_POST_ERROR_MESSAGE
    ),
    map((message: string) => new ErrorOccuredAction({ message }))
  );

  @Effect()
  public addEvent$: Observable<Action | void> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.AddEvent),
    map((action: AddEventAction) => this.calendarService.addEvent(action.payload.event)),
    catchError(() => of(new EventCreationErrorAction()))
  );
}
