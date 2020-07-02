import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { User } from 'src/app/core/user/model/user/user.model';

export const teamActionTypes = {
  newTeamRequested: '[Home Page] New Team Requested',
  newTeamCreateSuccess: '[Database API] New Team Create Success',
  newTeamCreateFailure: '[Database API] New Team Create Failure',

  loadTeamRequested: '[Home Page] Load Team Requested',
  loadTeamSuccess: '[Database API] Team Loaded Success',
  loadTeamFailure: '[Database API] Team Loaded Failure',

  loadTeamsRequested: '[Teams Loaded Guard] Load Teams Requested'
};

const newTeamRequested = createAction(teamActionTypes.newTeamRequested, props<{ request: NewTeamRequest }>());
const newTeamCreateSuccess = createAction(
  teamActionTypes.newTeamCreateSuccess,
  props<{ id: string; user: User; request: NewTeamRequest }>()
);
const newTeamCreateFailure = createAction(teamActionTypes.newTeamCreateFailure, props<{ error: Error }>());

export const allTeamsActions = {
  newTeamRequested,
  newTeamCreateSuccess,
  newTeamCreateFailure
};
