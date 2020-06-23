import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { Team } from 'src/app/core/team/model/team/team.model';

const types = {
  loadSelectedTeamRequested: '[Selected Team Loaded Guard] Load Selected Team Requested',
  loadSelectedTeamSuccess: '[Database API] Load Selected Team Success',
  loadSelectedTeamFailure: '[Database API] Load Seelcted Team Failure'
};

const loadSelectedTeamRequested = createAction(types.loadSelectedTeamRequested, props<{ id: string }>());
const loadSelectedTeamSuccess = createAction(types.loadSelectedTeamSuccess, props<{ team: Team }>());
const loadSelectedTeamFailure = createAction(types.loadSelectedTeamFailure, props<{ error: Error }>());

export const selectedTeamActions = {
  loadSelectedTeamRequested,
  loadSelectedTeamSuccess,
  loadSelectedTeamFailure
};
