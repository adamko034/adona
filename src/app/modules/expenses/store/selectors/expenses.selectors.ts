import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExpensesState } from '../reducer/expenses.reducer';

const selectExpensesState = createFeatureSelector<ExpensesState>('expenses');
const selectExpenses = createSelector(selectExpensesState, (state: ExpensesState) => Object.values(state.entities));
const selectExpensesLoaded = createSelector(selectExpensesState, (state: ExpensesState) => state.expensesLoaded);
const selectExpensesById = createSelector(selectExpensesState, (state, props) => state.entities[props.id]);

export const expensesQueries = {
  selectExpenses,
  selectExpensesById,
  selectExpensesLoaded
};
