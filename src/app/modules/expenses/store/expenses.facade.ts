import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ExpensesModule } from '../expenses.module';
import { actions } from './actions/expenses.actions';
import { ExpensesState } from './reducer/expenses.reducer';

@Injectable({ providedIn: ExpensesModule })
export class ExpensesFacade {
  constructor(private store: Store<ExpensesState>) {}

  public getExpenses() {
    this.store.dispatch(actions.expensesRequested);
  }
}
