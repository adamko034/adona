import { createAction, props } from '@ngrx/store';
import { Error } from '../../error/model/error.model';
import { NewTeamRequest } from '../../team/model/new-team-request.model';
import { Team } from '../../team/model/team.model';

export const teamActionTypes = {
  newTeamRequested: '[Home Page] New Team Requested',
  newTeamCreateSuccess: '[Database API] New Team Create Success',
  newTeamCreateFailure: '[Database API] New Team Create Failure'
};

const newTeamRequested = createAction(teamActionTypes.newTeamRequested, props<{ request: NewTeamRequest }>());
const newTeamCreateSuccess = createAction(teamActionTypes.newTeamCreateSuccess, props<{ team: Team }>());
const newTeamCreateFailure = createAction(teamActionTypes.newTeamCreateFailure, props<{ error: Error }>());

export const teamActions = {
  newTeamRequested,
  newTeamCreateSuccess,
  newTeamCreateFailure
};
