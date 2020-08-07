import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectRouterState = createFeatureSelector('router');

const selectRouteParams = createSelector(selectRouterState, (state: any) => state.state.params);
const selectCurrentRoute = createSelector(selectRouterState, (state: any) => state.state.url);
const selectRouteQueryParams = createSelector(selectRouterState, (state: any) => state.state.queryParams);
const selectData = createSelector(selectRouterState, (state: any) => state.state.data);
const selectCurrentRouteWithParams = createSelector(selectRouterState, (state: any) => {
  return { route: state.state.url, params: state.state.params };
});

export const routerQueries = {
  selectRouteParams,
  selectCurrentRoute,
  selectRouteQueryParams,
  selectData,
  currentRouteWithParams: selectCurrentRouteWithParams
};
