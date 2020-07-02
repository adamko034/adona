import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { Team } from 'src/app/core/team/model/team/team.model';

const types = {
  loadTeamRequested: '[Selected Team Loaded Guard] Load Selected Team Requested',
  loadTeamSuccess: '[Database API] Load Selected Team Success',
  loadTeamFailure: '[Database API] Load Seelcted Team Failure'
};

const loadTeamRequested = createAction(types.loadTeamRequested, props<{ id: string }>());
const loadTeamSuccess = createAction(types.loadTeamSuccess, props<{ team: Team }>());
const loadTeamFailure = createAction(types.loadTeamFailure, props<{ error: Error }>());

export const teamActions = {
  loadTeamRequested,
  loadTeamSuccess,
  loadTeamFailure
};
