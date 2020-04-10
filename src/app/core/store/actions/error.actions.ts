import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';

export const errorActionsTypes = {
  handle: '[Page] Handle Error',
  clear: '[Error Snackbar] Clear Error',
  broadcast: '[Error API] Broadcast Error'
};

const handleError = createAction(errorActionsTypes.handle, props<{ error: Error }>());
const broadcastError = createAction(errorActionsTypes.broadcast, props<{ error: Error }>());
const clearError = createAction(errorActionsTypes.clear);

export const errorActions = {
  handleError,
  clearError,
  broadcastError
};
