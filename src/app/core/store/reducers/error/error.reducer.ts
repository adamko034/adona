import { createReducer, on } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { errorActions } from 'src/app/core/store/actions/error.actions';

export interface ErrorState {
  error?: Error;
}

export const errorInitialState: ErrorState = {
  error: null
};

const errorReducer = createReducer(
  errorInitialState,
  on(errorActions.broadcastError, (state, action) => ({ ...state, error: action.error })),
  on(errorActions.clearError, (state) => ({ ...state, error: null }))
);

export function reducer(state: ErrorState | undefined, action) {
  return errorReducer(state, action);
}
