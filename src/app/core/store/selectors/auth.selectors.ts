import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';

const getAuth = createFeatureSelector<AuthState>('AuthState');
const getLoginFailure = createSelector(
  getAuth,
  (authState: AuthState) => authState.loginFailed
);

export const authQueries = {
  getLoginFailure
};
