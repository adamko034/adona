import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { Team } from 'src/app/core/team/model/team/team.model';

const types = {
  loadTeamsRequested: '[Settings Teams Page] Load Teams Requested',
  loadTeamsSuccess: '[Database API] Load Teams Success',
  loadTeamsFailure: '[Database API] Load Teams Failure'
};

const loadTeamsRequested = createAction(types.loadTeamsRequested);
const loadTeamsSuccess = createAction(types.loadTeamsSuccess, props<{ teams: Team[] }>());
const loadTeamsFailure = createAction(types.loadTeamsFailure, props<{ error: Error }>());

export const settingsTeamsActions = {
  loadTeamsSuccess,
  loadTeamsRequested,
  loadTeamsFailure
};
