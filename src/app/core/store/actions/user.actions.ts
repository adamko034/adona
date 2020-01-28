import { createAction, props } from '@ngrx/store';
import { User } from '../../user/model/user.model';

export const userActionTypes = {
  findUser: '[Auth Guard] Find User',
  userFound: '[Database API] User Found',
  teamChanged: '[Datebase API] Team Changed',
  teamAdded: '[Database API] Team Added'
};

const findUser = createAction(userActionTypes.findUser, props<{ id: string }>());
const userFound = createAction(userActionTypes.userFound, props<{ user: User }>());

const teamChanged = createAction(userActionTypes.teamChanged, props<{ teamId: string }>());
const teamAdded = createAction(userActionTypes.teamAdded, props<{ id: string; name: string; updated: Date }>());

export const userActions = {
  findUser,
  userFound,
  teamChanged,
  teamAdded
};
