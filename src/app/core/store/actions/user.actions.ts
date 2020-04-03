import { createAction, props } from '@ngrx/store';
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
  updateNameFailure: '[Database API] Update Name Failure'
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
  updateNameFailure
};
