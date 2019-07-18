import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { User } from '../shared/models/auth/user-model';
import { AuthActionTypes } from '../modules/auth/store/actions/auth.actions';
import { AuthState, authReducer } from '../modules/auth/store/reducers/auth.reducer';


export interface AppState {
  auth: AuthState
}


export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
