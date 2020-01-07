import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { ExpenseGroup } from '../../model/expense-group.model';
import { ExpensesService } from '../../services/expenses.service';
import { actions, types } from '../actions/expenses.actions';

@Injectable()
export class ExpensesEffects {
  constructor(private actions$: Actions, private authFacade: AuthFacade, private expensesService: ExpensesService) {}

  public expensesRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(types.expensesRequested),
      concatMap(action => of(action).pipe(withLatestFrom(this.authFacade.getUser()))),
      switchMap(([action, user]) => this.expensesService.getExpenses(user.id)),
      map((expenses: ExpenseGroup[]) => actions.expensesLoadSuccess({ expenses })),
      catchError(err => of(actions.expensesLoadFailure({ error: { errorObj: err } })))
    )
  );
}
