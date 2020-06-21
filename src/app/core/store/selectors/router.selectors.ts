import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectRouterState = createFeatureSelector('router');

const selectRouteParams = createSelector(selectRouterState, (state: any) => state.state.params);
const selectCurrentRoute = createSelector(selectRouterState, (state: any) => state.state.url);
const selectRouteQueryParams = createSelector(selectRouterState, (state: any) => state.state.queryParams);
const selectData = createSelector(selectRouterState, (state: any) => state.state.data);

export const routerQueries = {
  selectRouteParams,
  selectCurrentRoute,
  selectRouteQueryParams,
  selectData
};
