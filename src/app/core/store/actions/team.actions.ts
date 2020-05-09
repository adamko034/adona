import { createAction, props } from '@ngrx/store';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { Error } from '../../error/model/error.model';
import { Team } from '../../team/model/team.model';

export const teamActionTypes = {
  newTeamRequested: '[Home Page] New Team Requested',
  newTeamCreateSuccess: '[Database API] New Team Create Success',
  newTeamCreateFailure: '[Database API] New Team Create Failure',

  loadSelectedTeamRequested: '[Home Page] Load Selected Team Requested',
  loadTeamRequested: '[Home Page] Load Team Requested',
  loadTeamSuccess: '[Database API] Team Loaded Success',
  loadTeamFailure: '[Database API] Team Loaded Failure'
};

const newTeamRequested = createAction(teamActionTypes.newTeamRequested, props<{ request: NewTeamRequest }>());
const newTeamCreateSuccess = createAction(teamActionTypes.newTeamCreateSuccess, props<{ team: Team }>());
const newTeamCreateFailure = createAction(teamActionTypes.newTeamCreateFailure, props<{ error: Error }>());

const loadSelectedTeamRequested = createAction(teamActionTypes.loadSelectedTeamRequested);
const loadTeamRequested = createAction(teamActionTypes.loadTeamRequested, props<{ id: string }>());
const loadTeamSuccess = createAction(teamActionTypes.loadTeamSuccess, props<{ team: Team }>());
const loadTeamFailure = createAction(teamActionTypes.loadTeamFailure, props<{ error: Error }>());

export const teamActions = {
  newTeamRequested,
  newTeamCreateSuccess,
  newTeamCreateFailure,
  loadSelectedTeamRequested,
  loadTeamRequested,
  loadTeamSuccess,
  loadTeamFailure
};
