import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { ExpenseGroup } from '../../model/expense-group.model';
import { actions } from '../actions/expenses.actions';

export const expensesStateFeatureKey = 'expenses';

export interface ExpensesState extends EntityState<ExpenseGroup> {}

export const adapter: EntityAdapter<ExpenseGroup> = createEntityAdapter<ExpenseGroup>();

export const intialState: ExpensesState = adapter.getInitialState();

export const reducers = createReducer(
  intialState,
  on(actions.expensesLoadSuccess, (state, action) => adapter.addMany(action.expenses, state))
);

export function reducer(state: ExpensesState | undefined, action: Action) {
  return reducers(state, action);
}
