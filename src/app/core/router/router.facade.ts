import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { sortBy } from 'lodash';
import { Observable } from 'rxjs';
import { routes, settingsRoutes } from 'src/app/core/router/constants/routes.constants';
import { RouteWithParams } from 'src/app/core/router/model/route-with-params.model';
import { routerActions } from 'src/app/core/router/store/actions/router.actions';
import { routerQueries } from 'src/app/core/router/store/selectors/router.selectors';
import { Route } from './model/route.model';

@Injectable({ providedIn: 'root' })
export class RouterFacade {
  constructor(private store: Store<RouterReducerState>) {}

  public selectRouteParams(): Observable<Params> {
    return this.store.pipe(select(routerQueries.selectRouteParams));
  }

  public selectCurrentRoute(): Observable<string> {
    return this.store.pipe(select(routerQueries.selectCurrentRoute));
  }

  public selectCurrentRouteWithParams(): Observable<RouteWithParams> {
    return this.store.pipe(select(routerQueries.currentRouteWithParams));
  }

  public selectRouteQueryParams(): Observable<Params> {
    return this.store.pipe(select(routerQueries.selectRouteQueryParams));
  }

  public selectRouteData<T>(): Observable<T> {
    return this.store.pipe(select(routerQueries.selectData));
  }

  public selectAdonaRoutes(): Route[] {
    return sortBy(routes, 'id');
  }

  public selectSettingsRoutes(): Route[] {
    return sortBy(settingsRoutes, 'id');
  }

  public navigateAfterTeamDeleted(teamId: string): void {
    this.store.dispatch(routerActions.teamDeleted({ id: teamId }));
  }
}
