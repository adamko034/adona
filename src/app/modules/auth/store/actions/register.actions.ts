import { createAction, props } from '@ngrx/store';
import { Credentials } from 'src/app/core/auth/model/credentials.model';

export const registerActionTypes = {
  registerRequested: '[Register Page] Register Requested',
  registerSuccess: '[Database API] Register Success',
  registerFailure: '[Database API] Register Failure'
};

const registerRequested = createAction(registerActionTypes.registerRequested, props<{ credentials: Credentials }>());
const registerSuccess = createAction(registerActionTypes.registerSuccess);
const registerFailure = createAction(registerActionTypes.registerFailure, props<{ error: any }>());

export const registerActions = {
  registerRequested,
  registerSuccess,
  registerFailure
};
