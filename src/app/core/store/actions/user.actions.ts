import { createAction, props } from '@ngrx/store';
import { ToastrData } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.model';
import { Invitation } from 'src/app/core/invitations/models/invitation/invitation.model';
import { UserTeam } from 'src/app/core/user/model/user-team.model';
import { Error } from '../../error/model/error.model';
import { ChangeTeamRequest } from '../../team/model/change-team-request.model';
import { User } from '../../user/model/user.model';

export const userActionTypes = {
  loadUserRequested: '[Auth Guard] Load User Requested',
  loadUserSuccess: '[Database API] Load User Success',
  loadUserFailure: '[Database API] Load User Failure',

  changeTeamRequested: '[Change Team Dialog] Change Team Requested',
  changeTeamFailure: '[Database API] Change Team Failure',
  changeTeamSuccess: '[Datebase API] Change Team Success',

  teamAdded: '[Database API] Team Added',

  updateNameRequested: '[Settings Page] Update Name Requested',
  updateNameSuccess: '[Database API] Update Name Success',
  updateNameFailure: '[Database API] Update Name Failure',

  handleInvitationRequested: '[Page] Handle Invitation Requested',
  handleInvitationAccept: '[App API] Handle Invitation Accept',
  handleInvitationReject: '[App API] Handle Invitation Reject',
  handleInvitationSuccess: '[Database API] Handle Invitation Success',
  handleInvitationFailure: '[Database API] Handle Inbitation Failure'
};

const loadUserRequested = createAction(userActionTypes.loadUserRequested, props<{ id: string }>());
const loadUserSuccess = createAction(userActionTypes.loadUserSuccess, props<{ user: User }>());
const loadUserFailure = createAction(userActionTypes.loadUserFailure, props<{ error: Error }>());

const changeTeamRequested = createAction(userActionTypes.changeTeamRequested, props<{ request: ChangeTeamRequest }>());
const changeTeamFailure = createAction(userActionTypes.changeTeamFailure, props<{ error: Error }>());
const changeTeamSuccess = createAction(userActionTypes.changeTeamSuccess, props<{ teamId: string; updated: Date }>());

const teamAdded = createAction(userActionTypes.teamAdded, props<{ id: string; name: string; updated: Date }>());

const updateNameRequested = createAction(userActionTypes.updateNameRequested, props<{ id: string; newName: string }>());
const updateNameSuccess = createAction(userActionTypes.updateNameSuccess, props<{ newName: string }>());
const updateNameFailure = createAction(userActionTypes.updateNameFailure, props<{ error: Error }>());

const handleInvitationRequested = createAction(userActionTypes.handleInvitationRequested, props<{ user: User }>());
const handleInvitationSuccess = createAction(userActionTypes.handleInvitationSuccess, props<{ userTeam: UserTeam }>());
const handleInvitationFailure = createAction(
  userActionTypes.handleInvitationFailure,
  props<{ error: Error; toastr: ToastrData }>()
);
const handleInvitationAccept = createAction(
  userActionTypes.handleInvitationAccept,
  props<{ user: User; invitation: Invitation }>()
);
const handleInvitationReject = createAction(userActionTypes.handleInvitationReject);

export const userActions = {
  loadUserRequested,
  loadUserSuccess,
  loadUserFailure,
  changeTeamRequested,
  changeTeamFailure,
  changeTeamSuccess,
  teamAdded,
  updateNameRequested,
  updateNameSuccess,
  updateNameFailure,
  handleInvitationRequested,
  handleInvitationAccept,
  handleInvitationReject,
  handleInvitationSuccess,
  handleInvitationFailure
};
