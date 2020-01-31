import { createAction, props } from '@ngrx/store';
import { Error } from '../../error/model/error.model';
import { ChangeTeamRequest } from '../../team/model/change-team-request.model';
import { NewTeamRequest } from '../../team/model/new-team-request.model';
import { Team } from '../../team/model/team.model';

export const teamActionTypes = {
  newTeamRequested: '[Home Page] New Team Requested',
  newTeamCreateSuccess: '[Database API] New Team Create Success',
  newTeamCreateFailure: '[Database API] New Team Create Failure',

  changeTeamRequested: '[Change Team Dialog] Change Team Requested',
  changeTeamFailure: '[Database API] Change Team Failure',

  loadSelectedTeamRequested: '[Home Page] Load Selected Team Requested',
  loadTeamRequested: '[Home Page] Load Team Requested',
  teamLoadedSuccess: '[Database API] Team Loaded Success',
  teamLoadedFailure: '[Database API] Team Loaded Failure'
};

const newTeamRequested = createAction(teamActionTypes.newTeamRequested, props<{ request: NewTeamRequest }>());
const newTeamCreateSuccess = createAction(teamActionTypes.newTeamCreateSuccess, props<{ team: Team }>());
const newTeamCreateFailure = createAction(teamActionTypes.newTeamCreateFailure, props<{ error: Error }>());

const changeTeamRequested = createAction(teamActionTypes.changeTeamRequested, props<{ request: ChangeTeamRequest }>());
const changeTeamFailure = createAction(teamActionTypes.changeTeamFailure, props<{ error: Error }>());

const loadSelectedTeamRequested = createAction(teamActionTypes.loadSelectedTeamRequested);
const loadTeamRequested = createAction(teamActionTypes.loadTeamRequested, props<{ id: string }>());
const teamLoadedSuccess = createAction(teamActionTypes.teamLoadedSuccess, props<{ team: Team }>());
const teamLoadedFailure = createAction(teamActionTypes.teamLoadedFailure, props<{ error: Error }>());

export const teamActions = {
  newTeamRequested,
  newTeamCreateSuccess,
  newTeamCreateFailure,
  changeTeamRequested,
  changeTeamFailure,
  loadSelectedTeamRequested,
  loadTeamRequested,
  teamLoadedSuccess,
  teamLoadedFailure
};
