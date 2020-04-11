import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';

export const errorActionsTypes = {
  broadcast: '[Page] Error Occured',
  clear: '[Error Snackbar] Clear'
};

const broadcast = createAction(errorActionsTypes.broadcast, props<{ error: Error }>());
const clear = createAction(errorActionsTypes.clear);

export const errorActions = {
  broadcast,
  clear
};
