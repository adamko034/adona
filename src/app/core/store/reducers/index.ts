import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { errorReducer, ErrorState } from 'src/app/core/store/reducers/error/error.reducer';
import { environment } from '../../../../environments/environment';
import { authReducer, AuthState } from './auth/auth.reducer';
import { teamReducer, TeamState } from './team/team.reducer';

export interface AppState {
  auth: AuthState;
  error: ErrorState;
  router: RouterReducerState;
  team: TeamState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  error: errorReducer,
  router: routerReducer,
  team: teamReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
