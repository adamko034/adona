import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, withLatestFrom, switchMap, take } from 'rxjs/operators';
import { ErrorOccuredAction } from 'src/app/core/store/actions/error.actions';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import {
  AllEventsLoadedAction,
  CalendarActions,
  CalendarActionTypes,
  EventCreationErrorAction,
  EventsLoadedErrorAction,
  NewEventRequestedAction,
  NewEventAddedAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { CalendarState } from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { calendarQueries } from 'src/app/modules/calendar/store/selectors/calendar.selectors';
import { errors } from 'src/app/shared/constants/errors.constants';
import { CalendarMapper } from '../../mappers/calendar.mapper';
import { NewEventRequest } from 'src/app/modules/calendar/model/new-event-request.model';

@Injectable()
export class CalendarEffects {
  constructor(
    private actions$: Actions,
    private calendarService: CalendarService,
    private mapper: CalendarMapper,
    private store: Store<CalendarState>
  ) {}

  @Effect()
  public allEventsRequested$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.AllEventsRequested),
    withLatestFrom(this.store.pipe(select(calendarQueries.selectAllEventsLoaded))),
    filter(([action, eventsLoaded]) => !eventsLoaded),
    mergeMap(() => this.calendarService.getEvents()),
    take(1),
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
  public newEventRequested$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.NewEventRequested),
    map((action: NewEventRequestedAction) => action.payload.newEvent),
    switchMap((newEventRequest: NewEventRequest) => this.calendarService.addEvent(newEventRequest)),
    map((event: Event) => new NewEventAddedAction({ event })),
    catchError(() => of(new EventCreationErrorAction()))
  );

  @Effect()
  public eventCreationError$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.EventCreationError),
    map((action: EventCreationErrorAction) =>
      action.payload ? action.payload.error : errors.DEFAULT_API_POST_ERROR_MESSAGE
    ),
    map((message: string) => new ErrorOccuredAction({ message }))
  );
}
