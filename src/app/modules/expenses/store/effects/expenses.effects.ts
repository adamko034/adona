import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ErrorOccuredAction } from 'src/app/core/store/actions/error.actions';
import { errors } from 'src/app/shared/constants/errors.constants';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { ExpenseGroup } from '../../model/expense-group.model';
import { ExpensesService } from '../../services/expenses.service';
import { expensesActions, expensesActionsTypes } from '../actions/expenses.actions';

@Injectable()
export class ExpensesEffects {
  constructor(private actions$: Actions, private authFacade: AuthFacade, private expensesService: ExpensesService) {}

  public expensesRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(expensesActionsTypes.expensesRequested),
      concatMap(action => of(action).pipe(withLatestFrom(this.authFacade.getUser()))),
      switchMap(([action, user]) => this.expensesService.getExpenses(user.id)),
      map((expenses: ExpenseGroup[]) => expensesActions.expensesLoadSuccess({ expenses })),
      catchError(err => of(expensesActions.expensesLoadFailure({ error: { errorObj: err } })))
    )
  );

  public expensesLoadFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(expensesActions.expensesLoadFailure),
      map(action => {
        const message = action.error.message ? action.error.message : errors.DEFAULT_API_GET_ERROR_MESSAGE;
        return { ...action.error, message };
      }),
      map((error: Error) => new ErrorOccuredAction({ error }))
    )
  );
}
