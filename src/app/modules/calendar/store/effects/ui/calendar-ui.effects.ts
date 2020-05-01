import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { UserFacade } from 'src/app/core/user/user.facade';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { CalendarFacade } from 'src/app/modules/calendar/store/calendar.facade';

@Injectable()
export class CalendarUiEffects {
  constructor(private actions$: Actions, private calendarFacade: CalendarFacade, private userFacade: UserFacade) {}

  public viewDateChange$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(calendarActions.ui.viewDateChange),
        concatMap((action) => of(action).pipe(withLatestFrom(this.userFacade.selectUser()))),
        tap(([{ date }, { selectedTeamId }]) => this.calendarFacade.loadMonthEvents(date, selectedTeamId)),
        map(([action]) => action)
      );
    },
    { dispatch: false }
  );
}
