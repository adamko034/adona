import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { CalendarFacade } from 'src/app/modules/calendar/store/calendar.facade';
import { TimeService } from 'src/app/shared/services/time/time.service';

@Injectable()
export class CalendarEventsEffects {
  constructor(
    private actions$: Actions,
    private errorEffectsService: ErrorEffectService,
    private calendarService: CalendarService,
    private calendarFacade: CalendarFacade,
    private timeService: TimeService
  ) {}

  public monthEventsRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(calendarActions.events.loadMonthEventsRequest),
      concatMap((action) => of(action).pipe(withLatestFrom(this.calendarFacade.selectMonthsLoaded(action.teamId)))),
      filter(([action, monthsLoaded]) => {
        return (
          monthsLoaded.filter((date) => this.timeService.Comparison.areDatesInTheSameMonth(date, action.date))
            .length === 0
        );
      }),
      mergeMap(([action]) => {
        return this.calendarService.getMonthEvents(action.date, action.teamId).pipe(
          map((events: Event[]) =>
            calendarActions.events.loadMonthEventsSuccess({ events, date: action.date, teamId: action.teamId })
          ),
          catchError((err) => {
            const error = ErrorBuilder.from().withErrorObject(err).build();
            return of(calendarActions.events.loadMonthEventsFailure({ error }));
          })
        );
      })
    );
  });

  public loadMonthEventsFailure$ = this.errorEffectsService.createFrom(
    this.actions$,
    calendarActions.events.loadMonthEventsFailure
  );
}
