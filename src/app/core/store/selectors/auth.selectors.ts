import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';

const selectAuth = createFeatureSelector<AuthState>('auth');
const selectLoginFailure = createSelector(
  selectAuth,
  (authState: AuthState) => authState.loginFailed
);
const selectLoggedIn = createSelector(
  selectAuth,
  (authState: AuthState) => authState.loggedIn
);

export const authQueries = {
  selectLoginFailure,
  selectLoggedIn
};
