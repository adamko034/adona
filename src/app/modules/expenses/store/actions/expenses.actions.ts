import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { ExpenseGroup } from '../../model/expense-group.model';

export const types = {
  expensesRequested: '[Expenses Page] Expenses Requested',
  expensesLoadedSuccess: '[Expenses API] Expenses Loaded Success',
  expensesLoadedFailure: '[Expenses API] Expenses Loaded Failure'
};

const expensesRequested = createAction(types.expensesRequested);
const expensesLoadSuccess = createAction(types.expensesLoadedSuccess, props<{ expenses: ExpenseGroup[] }>());
const expensesLoadFailure = createAction(types.expensesLoadedFailure, props<{ error: Error }>());

export const actions = {
  expensesRequested,
  expensesLoadSuccess,
  expensesLoadFailure
};
