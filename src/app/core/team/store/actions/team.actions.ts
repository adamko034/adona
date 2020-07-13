import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { NewTeamRequest } from 'src/app/core/team/model/requests/new-team/new-team-request.model';
import { TeamNameUpdateRequest } from 'src/app/core/team/model/requests/update-name/team-name-update-request.model';
import { Team } from 'src/app/core/team/model/team/team.model';
import { User } from 'src/app/core/user/model/user/user.model';

const types = {
  loadTeamRequested: '[Settings Team Details Page] Load Team Requested',
  loadTeamSuccess: '[Database API] Load Selected Team Success',
  loadTeamFailure: '[Database API] Load Seelcted Team Failure',

  newTeamRequested: '[Home Page] New Team Requested',
  newTeamCreateSuccess: '[Database API] New Team Create Success',
  newTeamCreateFailure: '[Database API] New Team Create Failure',

  updateNameRequested: '[Team Details Settings Page] Update Team Name Requested',
  updateNameSuccess: '[Database API] Update Team Name Requested',
  updateNameFailure: '[Database API] Update Team Name Requested'
};
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
const updateNameSuccess = createAction(types.updateNameSuccess, props<{ teamId: string; newName: string }>());
const updateNameFailure = createAction(types.updateNameFailure, props<{ error: Error }>());

export const teamActions = {
  loadTeamRequested,
  loadTeamSuccess,
  loadTeamFailure,

  newTeamRequested,
  newTeamCreateSuccess,
  newTeamCreateFailure,

  updateNameRequested,
  updateNameSuccess,
  updateNameFailure
};
