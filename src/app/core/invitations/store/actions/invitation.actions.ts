import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { NewInvitationRequest } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.model';

const types = {
  invitationsSendRequest: '[New Team Dialog] Invitations Send Request',
  invitationsSendSuccess: '[Database API] Invitations Send Success',
  invitationsSendFailure: '[Database API] Invitations Send Failure'
};

const invitationsSendRequest = createAction(types.invitationsSendRequest, props<{ request: NewInvitationRequest }>());
const invitationsSendFailure = createAction(types.invitationsSendFailure, props<{ error: Error }>());
const invitationsSendSuccess = createAction(types.invitationsSendSuccess);

export const invitationActions = {
  invitationsSendRequest,
  invitationsSendFailure,
  invitationsSendSuccess
};
