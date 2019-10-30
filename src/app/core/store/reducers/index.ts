import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { authReducer, AuthState } from './auth/auth.reducer';
import { ErrorState, errorReducer } from 'src/app/core/store/reducers/error/error.reducer';
import {
  CalendarState,
  calendarReducer
} from 'src/app/modules/calendar/store/reducers/calendar.reducer';

export interface AppState {
  auth: AuthState;
  error: ErrorState;
  calendar: CalendarState;
  router: RouterReducerState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  error: errorReducer,
  calendar: calendarReducer,
  router: routerReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
