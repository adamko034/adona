import { createAction, props } from '@ngrx/store';
import { NewTeamRequest } from '../../user/model/new-team-request.model';

export const userActionTypes = {
  newTeamRequested: '[Home Page] New Team Requested',
  newTeamCreateSuccess: '[Database API] New Team Create Success',
  newTeamCreateFailure: '[Database API] New Team Create Failure'
};

const newTeamRequested = createAction(userActionTypes.newTeamRequested, props<{ request: NewTeamRequest }>());

export const userActions = {
  newTeamRequested
};
