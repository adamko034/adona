import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectRouterState = createFeatureSelector('router');

const selectRouteParams = createSelector(selectRouterState, (state: any) => state.state.params);

export const routerQueries = {
  selectRouteParams
};
