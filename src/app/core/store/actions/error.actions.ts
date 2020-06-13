import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { ToastrData } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.model';

export const errorActionsTypes = {
  handle: '[Page] Handle Error',
  clear: '[Error Snackbar] Clear Error',
  broadcast: '[Error API] Broadcast Error'
};

const handleError = createAction(errorActionsTypes.handle, props<{ error: Error; toastr?: ToastrData }>());
const broadcastError = createAction(errorActionsTypes.broadcast, props<{ error: Error; toastr?: ToastrData }>());
const clearError = createAction(errorActionsTypes.clear);

export const errorActions = {
  handleError,
  clearError,
  broadcastError
};
