import { ErrorActions, ErrorActionTypes } from 'src/app/core/store/actions/error.actions';
import { Error } from 'src/app/core/error/model/error.model';

export interface ErrorState {
  error: Error;
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
