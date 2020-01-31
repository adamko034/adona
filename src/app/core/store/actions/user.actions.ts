import { createAction, props } from '@ngrx/store';
import { User } from '../../user/model/user.model';

export const userActionTypes = {
  getUser: '[Auth Guard] Find User',
  userFound: '[Database API] User Found',
  teamChanged: '[Datebase API] Team Changed',
  teamAdded: '[Database API] Team Added'
};

const getUser = createAction(userActionTypes.getUser, props<{ id: string }>());
const userFound = createAction(userActionTypes.userFound, props<{ user: User }>());

const teamChanged = createAction(userActionTypes.teamChanged, props<{ teamId: string; updated: Date }>());
const teamAdded = createAction(userActionTypes.teamAdded, props<{ id: string; name: string; updated: Date }>());

export const userActions = {
  getUser,
  userFound,
  teamChanged,
  teamAdded
};
