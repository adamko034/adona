import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ErrorOccuredAction } from 'src/app/core/store/actions/error.actions';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import {
  CalendarActions,
  CalendarActionTypes,
  EventCreationErrorAction,
  EventsLoadedAction,
  EventsLoadedErrorAction,
  EventUpdatedAction,
  EventUpdateErrorAction,
  MonthEventsRequestedAction,
  NewEventAddedAction,
  NewEventRequestedAction,
  UpdateEventRequestedAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { errors } from 'src/app/shared/constants/errors.constants';
import { TimeService } from 'src/app/shared/services/time/time.service';

@Injectable()
export class CalendarEffects {
  constructor(private actions$: Actions, private calendarService: CalendarService, private timeService: TimeService) {}

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
    switchMap((event: Event) => this.calendarService.addEvent(event)),
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

  @Effect()
  public updateEventRequested$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.UpdateEventRequested),
    map((action: UpdateEventRequestedAction) => action.payload.event),
    switchMap((event: Event) => this.calendarService.updateEvent(event)),
    map((event: Event) => {
      const eventUpdate: Update<Event> = {
        id: event.id,
        changes: event
      };

      return new EventUpdatedAction({ eventUpdate });
    }),
    catchError(() => of(new EventUpdateErrorAction()))
  );

  @Effect()
  public eventUpdateError$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.EventUpdateError),
    map((action: EventUpdateErrorAction) =>
      action.payload ? action.payload.error : errors.DEFAULT_API_PUT_ERROR_MESSAGE
    ),
    map((message: string) => new ErrorOccuredAction({ message }))
  );
}
