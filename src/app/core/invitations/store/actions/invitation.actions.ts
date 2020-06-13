import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { ToastrData } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.model';
import { InvitationRequest } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.model';

const types = {
  invitationsSendRequest: '[New Team Dialog] Invitations Send Request',
  invitationsSendSuccess: '[Database API] Invitations Send Success',
  invitationsSendFailure: '[Database API] Invitations Send Failure'
};

const invitationsSendRequest = createAction(types.invitationsSendRequest, props<{ request: InvitationRequest }>());
const invitationsSendFailure = createAction(
  types.invitationsSendFailure,
  props<{ error: Error; toastr: ToastrData }>()
);
const invitationsSendSuccess = createAction(types.invitationsSendSuccess);

export const invitationActions = {
  invitationsSendRequest,
  invitationsSendFailure,
  invitationsSendSuccess
};
