import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { ExpenseGroup } from '../../model/expense-group.model';
import { expensesActions } from '../actions/expenses.actions';

export const expensesStateFeatureKey = 'expenses';

export interface ExpensesState extends EntityState<ExpenseGroup> {
  expensesLoaded: boolean;
}

export const adapter: EntityAdapter<ExpenseGroup> = createEntityAdapter<ExpenseGroup>();

export const intialState: ExpensesState = adapter.getInitialState({
  expensesLoaded: false
});

export const reducers = createReducer(
  intialState,
  on(expensesActions.expensesLoadSuccess, (state, action) =>
    adapter.addMany(action.expenses, { ...state, expensesLoaded: true })
  )
);

export function reducer(state: ExpensesState | undefined, action: Action) {
  return reducers(state, action);
}
