import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { CalendarFacade } from 'src/app/modules/calendar/store/calendar.facade';

@Injectable()
export class CalendarUiEffects {
  constructor(private actions$: Actions, private calendarFacade: CalendarFacade) {}

  public viewDateChange$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(calendarActions.ui.viewDateChange),
        tap((action) => this.calendarFacade.loadMonthEvents(action.date))
      );
    },
    { dispatch: false }
  );
}
