import { createAction, props } from '@ngrx/store';

const types = {
  teamDeleted: '[Router Action] Team Removed'
};

const teamDeleted = createAction(types.teamDeleted, props<{ id: string }>());

export const routerActions = {
  teamDeleted
};
