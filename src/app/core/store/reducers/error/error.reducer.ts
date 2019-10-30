import { Error } from 'src/app/core/error/model/error.model';
import { ErrorActions, ErrorActionTypes } from 'src/app/core/store/actions/error.actions';

export interface ErrorState {
  error?: Error;
}

export const initialState: ErrorState = {
  error: null
};

export function errorReducer(state: ErrorState = initialState, action: ErrorActions) {
  switch (action.type) {
    case ErrorActionTypes.ErrorOccured:
      return { ...state, error: action.payload.error };
    default:
      return { ...state };
  }
}
