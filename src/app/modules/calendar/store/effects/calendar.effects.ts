import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { errors } from 'src/app/core/error/constants/errors.constants';
import { ErrorOccuredAction } from 'src/app/core/store/actions/error.actions';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import {
  CalendarActions,
  CalendarActionTypes,
  CalendarViewDateChangedAction,
  EventCreationErrorAction,
  EventDeleteErrorAction,
  EventDeleteRequestedAction,
  EventDeleteSuccessAction,
  EventsLoadedAction,
  EventsLoadedErrorAction,
  EventUpdatedAction,
  EventUpdateErrorAction,
  MonthEventsRequestedAction,
  NewEventAddedAction,
  NewEventRequestedAction,
  UpdateEventRequestedAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { Error } from '../../../../core/error/model/error.model';
import { CalendarFacade } from '../calendar.facade';

@Injectable()
export class CalendarEffects {
  constructor(
    private actions$: Actions,
    private calendarService: CalendarService,
    private timeService: TimeService,
    private calendarFacade: CalendarFacade
  ) {}

  @Effect()
  public monthEventsRequested$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.MonthEventsRequested),
    map((action: MonthEventsRequestedAction) => action.payload.date),
    withLatestFrom(this.calendarFacade.selectMonthsLoaded()),
    filter(([date, monthsLoaded]) => {
      const monthYear = this.timeService.Extraction.getYearMonthString(date);
      return monthsLoaded.findIndex(x => x === monthYear) < 0;
    }),
    mergeMap(([date]) => {
      return this.calendarService.getMonthEvents(date).pipe(
        map((events: Event[]) => {
          const yearMonth = this.timeService.Extraction.getYearMonthString(date);
          return new EventsLoadedAction({ events, yearMonth });
        })
      );
    }),
    catchError(err => of(new EventsLoadedErrorAction({ error: { errorObj: err } })))
  );

  @Effect()
  public eventsLoadedError$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.EventsLoadedError),
    map((action: EventsLoadedErrorAction) => {
      const message = action.payload.error.message
        ? action.payload.error.message
        : errors.DEFAULT_API_GET_ERROR_MESSAGE;

      return { ...action.payload.error, message };
    }),
    map((error: Error) => new ErrorOccuredAction({ error }))
  );

  @Effect()
  public newEventRequested$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.NewEventRequested),
    map((action: NewEventRequestedAction) => action.payload.newEvent),
    switchMap((event: Event) => this.calendarService.addEvent(event)),
    map((newEvent: Event) => new NewEventAddedAction({ event: newEvent })),
    catchError(err => of(new EventCreationErrorAction({ error: { errorObj: err } })))
  );

  @Effect()
  public eventCreationError$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.EventCreationError),
    map((action: EventCreationErrorAction) => {
      const message = action.payload.error.message
        ? action.payload.error.message
        : errors.DEFAULT_API_POST_ERROR_MESSAGE;
      return { ...action.payload.error, message };
    }),
    map((error: Error) => new ErrorOccuredAction({ error }))
  );

  @Effect()
  public updateEventRequested$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.UpdateEventRequested),
    map((action: UpdateEventRequestedAction) => action.payload.event),
    switchMap((event: Event) => this.calendarService.updateEvent(event)),
    map((updatedEvent: Event) => {
      const eventUpdate: Update<Event> = {
        id: updatedEvent.id,
        changes: updatedEvent
      };

      return new EventUpdatedAction({ eventUpdate });
    }),
    catchError(err => {
      return of(new EventUpdateErrorAction({ error: { errorObj: err } }));
    })
  );

  @Effect()
  public eventUpdateError$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.EventUpdateError),
    map((action: EventUpdateErrorAction) => {
      const message = action.payload.error.message
        ? action.payload.error.message
        : errors.DEFAULT_API_PUT_ERROR_MESSAGE;

      return { ...action.payload.error, message };
    }),
    map((error: Error) => new ErrorOccuredAction({ error }))
  );

  @Effect()
  public eventDeleteRequested$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.EventDeleteRequested),
    map((action: EventDeleteRequestedAction) => action.payload.id),
    switchMap((id: string) => {
      return this.calendarService.deleteEvent(id).pipe(mapTo(new EventDeleteSuccessAction({ id })));
    }),
    catchError(err => of(new EventDeleteErrorAction({ error: { errorObj: err } })))
  );

  @Effect()
  public eventDeleteError$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.EventDeleteError),
    map((action: EventUpdateErrorAction) => {
      return { message: errors.DEFAULT_API_DELETE_ERROR_MESSAGE, errorObj: action.payload.error.errorObj };
    }),
    map((error: Error) => new ErrorOccuredAction({ error }))
  );

  @Effect()
  public viewDateChanged$: Observable<Action> = this.actions$.pipe(
    ofType<CalendarActions>(CalendarActionTypes.ViewDateChanged),
    map((action: CalendarViewDateChangedAction) => new MonthEventsRequestedAction({ date: action.payload.newDate }))
  );
}
