import { ErrorActions, ErrorActionTypes } from 'src/app/core/store/actions/error.actions';

export interface ErrorState {
  message: string;
}

export const initialState: ErrorState = {
  message: null
};

export function errorReducer(state: ErrorState = initialState, action: ErrorActions) {
  switch (action.type) {
    case ErrorActionTypes.ErrorOccured:
      return { ...state, message: action.payload.message };
    default:
      return { ...state };
  }
}
