import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ErrorState } from 'src/app/core/store/reducers/error/error.reducer';

const selectErrorState = createFeatureSelector<ErrorState>('error');

const selectErrorMessage = createSelector(selectErrorState, (errorState: ErrorState) =>
  errorState.error ? errorState.error.message : null
);

export const errorQueries = {
  selectErrorMessage
};
