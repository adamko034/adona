import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';

export const resetPasswordActionTypes = {
  sendPasswordResetLinkRequested: '[Password Reset Page] Send Password Reset Link Requested',
  sendPasswordResetLinkSuccess: '[Database API] Send Password Reset Link Success',
  sendPasswordResetLinkFailure: '[Database API] Send Password Reset Link Failure',

  confirmPasswordResetRequested: '[Change Password Page] Confirm Password Reset Requested',
  confirmPasswordResetSuccess: '[Database API] Confirm Password Reset Success',
  confirmPasswordResetFailure: '[Database API] Confirm Password Reset Failure'
};

const sendPasswordResetLinkRequested = createAction(
  resetPasswordActionTypes.sendPasswordResetLinkRequested,
  props<{ email: string }>()
);
const sendPasswordResetLinkSuccess = createAction(resetPasswordActionTypes.sendPasswordResetLinkSuccess);
const sendPasswordResetLinkFailure = createAction(
  resetPasswordActionTypes.sendPasswordResetLinkFailure,
  props<{ error: Error }>()
);

const confirmPasswordResetRequested = createAction(
  resetPasswordActionTypes.confirmPasswordResetRequested,
  props<{ oobCode: string; newPassword: string }>()
);
const confirmPasswordResetSuccess = createAction(resetPasswordActionTypes.confirmPasswordResetSuccess);
const confirmPasswordResetFailure = createAction(
  resetPasswordActionTypes.confirmPasswordResetFailure,
  props<{ error: Error }>()
);

export const resetPasswordActions = {
  sendPasswordResetLinkRequested,
  sendPasswordResetLinkSuccess,
  sendPasswordResetLinkFailure,
  confirmPasswordResetRequested,
  confirmPasswordResetSuccess,
  confirmPasswordResetFailure
};
