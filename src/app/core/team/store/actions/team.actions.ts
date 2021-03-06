import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { NewTeamRequest } from 'src/app/core/team/model/requests/new-team/new-team-request.model';
import { TeamNameUpdateRequest } from 'src/app/core/team/model/requests/update-name/team-name-update-request.model';
import { Team } from 'src/app/core/team/model/team/team.model';
import { User } from 'src/app/core/user/model/user/user.model';

const types = {
  loadSelectedTeamRequested: '[Team Loaded Guard] Load Selected Team Requested',
  loadTeamRequested: '[Page] Load Team Requested',
  loadTeamSuccess: '[Database API] Load Team Success',
  loadTeamFailure: '[Database API] Load Team Failure',

  newTeamRequested: '[Home Page] New Team Requested',
  newTeamCreateSuccess: '[Database API] New Team Create Success',
  newTeamCreateFailure: '[Database API] New Team Create Failure',

  updateNameRequested: '[Team Details Settings Page] Update Team Name Requested',
  updateNameSuccess: '[Database API] Update Team Name Success',
  updateNameFailure: '[Database API] Update Team Name Failure',

  deleteTeamRequested: '[Team Settings Page] Delete Team Requested',
  deleteTeamSuccess: '[Database API] Delete Team Success',
  deleteTeamFailure: '[Database API] Delete Team Failure'
};

const loadSelectedTeamRequested = createAction(types.loadSelectedTeamRequested);
const loadTeamRequested = createAction(types.loadTeamRequested, props<{ id: string }>());
const loadTeamSuccess = createAction(types.loadTeamSuccess, props<{ team: Team }>());
const loadTeamFailure = createAction(types.loadTeamFailure, props<{ error: Error }>());

const newTeamRequested = createAction(types.newTeamRequested, props<{ request: NewTeamRequest }>());
const newTeamCreateSuccess = createAction(
  types.newTeamCreateSuccess,
  props<{ id: string; user: User; request: NewTeamRequest }>()
);
const newTeamCreateFailure = createAction(types.newTeamCreateFailure, props<{ error: Error }>());

const updateNameRequested = createAction(types.updateNameRequested, props<{ request: TeamNameUpdateRequest }>());
const updateNameSuccess = createAction(types.updateNameSuccess, props<{ team: Team }>());
const updateNameFailure = createAction(types.updateNameFailure, props<{ error: Error }>());

const deleteTeamRequested = createAction(types.deleteTeamRequested, props<{ id: string }>());
const deleteTeamSuccess = createAction(types.deleteTeamSuccess, props<{ id: string }>());
const deleteTeamFailure = createAction(types.deleteTeamFailure, props<{ error: Error }>());

export const teamActions = {
  loadSelectedTeamRequested,
  loadTeamRequested,
  loadTeamSuccess,
  loadTeamFailure,

  newTeamRequested,
  newTeamCreateSuccess,
  newTeamCreateFailure,

  updateNameRequested,
  updateNameSuccess,
  updateNameFailure,

  deleteTeamRequested,
  deleteTeamSuccess,
  deleteTeamFailure
};
