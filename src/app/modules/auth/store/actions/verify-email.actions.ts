import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';

export const verifyEmailAcionTypes = {
  confirmEmailRequested: '[Confirm Email Verification Page] Confirm Email Requested',
  confirmEmailSuccess: '[Database API] Confirm Email Success',
  confirmEmailFailure: '[Database API] Confirm Email Failure',

  sendEmailVerificationLinkRequested: '[Verify Email Page] Send Email Verification Link Requested',
  sendEmailVerificationLinkSuccess: '[Database API] Send Email Verification Link Success',
  sendEmailVerificationLinkFailure: '[Database API] Send Email Verification Link Failure'
};

const confirmEmailRequested = createAction(verifyEmailAcionTypes.confirmEmailRequested, props<{ code: string }>());
const confirmEmailSuccess = createAction(verifyEmailAcionTypes.confirmEmailSuccess);
const confirmEmailFailure = createAction(verifyEmailAcionTypes.confirmEmailFailure, props<{ error: Error }>());

const sendEmailVerificationLinkRequested = createAction(verifyEmailAcionTypes.sendEmailVerificationLinkRequested);
const sendEmailVerificationLinkSuccess = createAction(verifyEmailAcionTypes.sendEmailVerificationLinkSuccess);
const sendEmailVerificationLinkFailure = createAction(
  verifyEmailAcionTypes.sendEmailVerificationLinkFailure,
  props<{ error: Error }>()
);

export const verifyEmailActions = {
  confirmEmailRequested,
  confirmEmailSuccess,
  confirmEmailFailure,
  sendEmailVerificationLinkRequested,
  sendEmailVerificationLinkSuccess,
  sendEmailVerificationLinkFailure
};
