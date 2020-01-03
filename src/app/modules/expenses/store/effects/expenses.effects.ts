import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ExpensesModule } from '../../expenses.module';
import { types } from '../actions/expenses.actions';

@Injectable({ providedIn: ExpensesModule })
export class ExpensesEffects {
  constructor(private actions$: Actions) {}

  public expensesRequested$ = createEffect(() => this.actions$.pipe(ofType(types.expensesRequested)));
}
