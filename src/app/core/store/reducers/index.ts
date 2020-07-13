import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromGui from 'src/app/core/gui/store/reducer/gui.reducer';
import * as fromError from 'src/app/core/store/reducers/error/error.reducer';
import * as fromTeam from 'src/app/core/team/store/reducers/teams.reducer';
import { environment } from '../../../../environments/environment';
import * as fromApiRequests from '../reducers/api-requests/api-requests.reducer';
import * as fromAuth from './auth/auth.reducer';

export interface AppState {
  auth: fromAuth.AuthState;
  error: fromError.ErrorState;
  router: RouterReducerState;
  teams: fromTeam.TeamsState;
  gui: fromGui.GuiState;
  apiRequests: fromApiRequests.ApiRequestsState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.reducer,
  error: fromError.reducer,
  router: routerReducer,
  teams: fromTeam.reducer,
  gui: fromGui.reducer,
  apiRequests: fromApiRequests.reducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
