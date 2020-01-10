import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { ExpenseGroup } from '../../model/expense-group.model';

export const expensesActionsTypes = {
  expensesRequested: '[Expenses Page] Expenses Requested',
  expensesLoadedSuccess: '[Expenses API] Expenses Loaded Success',
  expensesLoadedFailure: '[Expenses API] Expenses Loaded Failure'
};

const expensesRequested = createAction(expensesActionsTypes.expensesRequested);
const expensesLoadSuccess = createAction(
  expensesActionsTypes.expensesLoadedSuccess,
  props<{ expenses: ExpenseGroup[] }>()
);
const expensesLoadFailure = createAction(expensesActionsTypes.expensesLoadedFailure, props<{ error: Error }>());

export const expensesActions = {
  expensesRequested,
  expensesLoadSuccess,
  expensesLoadFailure
};
