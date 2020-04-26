import { createAction, props } from '@ngrx/store';

export const apiRequestsActionTypes = {
  requestStart: '[APP] Request Start',
  requestSuccess: '[Database API] Request Success',
  requestFail: '[Database API] Request Fail'
};

const requestStart = createAction(apiRequestsActionTypes.requestStart, props<{ id: string }>());
const requestSuccess = createAction(apiRequestsActionTypes.requestSuccess, props<{ id: string }>());
const requestFail = createAction(apiRequestsActionTypes.requestFail, props<{ id: string; errorCode: string }>());

export const apiRequestActions = {
  requestStart,
  requestFail,
  requestSuccess
};
