import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { ErrorOccuredAction } from 'src/app/core/store/actions/error.actions';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { NewEventRequest } from 'src/app/modules/calendar/model/new-event-request.model';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import {
  EventsLoadedAction,
  CalendarActions,
  CalendarActionTypes,
  EventCreationErrorAction,
  EventsLoadedErrorAction,
  NewEventAddedAction,
  NewEventRequestedAction,
  MonthEventsRequestedAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { errors } from 'src/app/shared/constants/errors.constants';
import { TimeService } from 'src/app/shared/services/time/time.service';

@Injectable()
export class CalendarEffects {
  constructor(
    private actions$: Actions,
    private calendarService: CalendarService,
    private timeService: TimeService
  ) {}

  @Effect()
  public monthEventsRequested$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.MonthEventsRequested),
    map((action: MonthEventsRequestedAction) => action.payload.date),
    switchMap((date: Date) =>
      this.calendarService.getMonthEvents(date).pipe(
        map((events: Event[]) => {
          const yearMonth = this.timeService.Extraction.getYearMonthString(date);
          return new EventsLoadedAction({ events, yearMonth });
        })
      )
    ),
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
