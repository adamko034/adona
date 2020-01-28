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
  changeTeamFailure: '[Database API] Change Team Failure'
};

const newTeamRequested = createAction(teamActionTypes.newTeamRequested, props<{ request: NewTeamRequest }>());
const newTeamCreateSuccess = createAction(teamActionTypes.newTeamCreateSuccess, props<{ team: Team }>());
const newTeamCreateFailure = createAction(teamActionTypes.newTeamCreateFailure, props<{ error: Error }>());
const changeTeamRequested = createAction(teamActionTypes.changeTeamRequested, props<{ request: ChangeTeamRequest }>());
const changeTeamFailure = createAction(teamActionTypes.changeTeamFailure, props<{ error: Error }>());

export const teamActions = {
  newTeamRequested,
  newTeamCreateSuccess,
  newTeamCreateFailure,
  changeTeamRequested,
  changeTeamFailure
};
