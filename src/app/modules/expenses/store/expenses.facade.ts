import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { ExpenseGroup } from '../model/expense-group.model';
import { expensesActions } from './actions/expenses.actions';
import { ExpensesState } from './reducer/expenses.reducer';
import { expensesQueries } from './selectors/expenses.selectors';

@Injectable({ providedIn: 'root' })
export class ExpensesFacade {
  constructor(private store: Store<ExpensesState>, private routerFacade: RouterFacade) {}

  public loadExpenses() {
    this.store.dispatch(expensesActions.expensesRequested());
  }

  public getExpenses(): Observable<ExpenseGroup[]> {
    return this.store.pipe(
      select(expensesQueries.selectExpenses),
      map((expenses: ExpenseGroup[]) => {
        expenses.sort((g1, g2) => +g2.lastUpdated - +g1.lastUpdated);

        return expenses;
      })
    );
  }

  public getExpensesLoaded(): Observable<boolean> {
    return this.store.pipe(select(expensesQueries.selectExpensesLoaded));
  }

  public getExpensesGroupFromRouteParams(): Observable<ExpenseGroup> {
    return this.routerFacade.selectRouteParams().pipe(
      map((params: Params) => params.id),
      switchMap((id: string) => this.store.pipe(select(expensesQueries.selectExpensesById, { id })))
    );
  }
}
