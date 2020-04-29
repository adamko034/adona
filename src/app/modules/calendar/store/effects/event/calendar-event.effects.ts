import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DefaultErrorType } from 'src/app/core/error/enum/default-error-type.enum';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';

@Injectable()
export class CalendarEventEffects {
  constructor(
    private actions$: Actions,
    private calendarService: CalendarService,
    private errorEffectsService: ErrorEffectService
  ) {}

  public addEventRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(calendarActions.event.addEventRequest),
      switchMap((action) =>
        this.calendarService.addEvent(action.event).pipe(
          map((event: Event) => calendarActions.event.addEventSuccess({ event })),
          catchError((err) => {
            const error = ErrorBuilder.from().withErrorObject(err).build();
            return of(calendarActions.event.addEventFailure({ error }));
          })
        )
      )
    );
  });

  public addEventFailure$ = this.errorEffectsService.createFrom(
    this.actions$,
    calendarActions.event.addEventFailure,
    DefaultErrorType.ApiPost
  );

  public updateEventRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(calendarActions.event.updateEventRequest),
      switchMap((action) =>
        this.calendarService.updateEvent(action.event).pipe(
          map((updatedEvent: Event) => {
            const eventUpdate: Update<Event> = {
              id: updatedEvent.id,
              changes: updatedEvent
            };

            return calendarActions.event.updateEventSuccess({ eventUpdate });
          }),
          catchError((err) => {
            const error = ErrorBuilder.from().withErrorObject(err).build();
            return of(calendarActions.event.updateEventFailure({ error }));
          })
        )
      )
    );
  });

  public updateEventFailure$ = this.errorEffectsService.createFrom(
    this.actions$,
    calendarActions.event.updateEventFailure,
    DefaultErrorType.ApiPut
  );

  public deleteEventRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(calendarActions.event.deleteEventRequest),
      map((action) => action.id),
      switchMap((id: string) =>
        this.calendarService.deleteEvent(id).pipe(
          map(() => calendarActions.event.deleteEventSuccess({ id })),
          catchError((err) => {
            const error = ErrorBuilder.from().withErrorObject(err).build();
            return of(calendarActions.event.deleteEventFailure({ error }));
          })
        )
      )
    );
  });

  public deleteEventFailure$ = this.errorEffectsService.createFrom(
    this.actions$,
    calendarActions.event.deleteEventFailure,
    DefaultErrorType.ApiDelete
  );
}
