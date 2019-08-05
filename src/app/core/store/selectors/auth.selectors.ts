import { AppState } from 'src/app/core/store/reducers';
import { createSelector } from '@ngrx/store';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';

const getAuth = (state: AppState) => state.auth;
const getLoginFailure = createSelector(
  getAuth,
  (authState: AuthState) => authState.loginFailed
);

export const authQuery = {
  getAuth,
  getLoginFailure
};
