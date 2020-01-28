import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';

const selectAuth = createFeatureSelector<AuthState>('auth');
const selectUser = createSelector(selectAuth, (authState: AuthState) => authState.user);

export const userQueries = {
  selectUser
};
