import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { errorReducer, ErrorState } from 'src/app/core/store/reducers/error/error.reducer';
import { environment } from '../../../../environments/environment';
import * as fromAuth from './auth/auth.reducer';
import * as fromGui from './gui/gui.reducer';
import * as fromTeam from './team/team.reducer';

export interface AppState {
  auth: fromAuth.AuthState;
  error: ErrorState;
  router: RouterReducerState;
  team: fromTeam.TeamState;
  gui: fromGui.GuiState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.reducer,
  error: errorReducer,
  router: routerReducer,
  team: fromTeam.reducer,
  gui: fromGui.reducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
