import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { sortBy } from 'lodash';
import { Observable } from 'rxjs';
import { routes, settingsRoutes } from 'src/app/core/router/constants/routes.constants';
import { routerQueries } from '../store/selectors/router.selectors';
import { Route } from './model/route.model';

@Injectable({ providedIn: 'root' })
export class RouterFacade {
  constructor(private store: Store<RouterReducerState>) {}

  public selectRouteParams(): Observable<Params> {
    return this.store.pipe(select(routerQueries.selectRouteParams));
  }

  public selectCurrentRute(): Observable<string> {
    return this.store.pipe(select(routerQueries.selectCurrentRoute));
  }

  public selectAdonaRoutes(): Route[] {
    return sortBy(routes, 'id');
  }

  public selectSettingsRoutes(): Route[] {
    return sortBy(settingsRoutes, 'id');
  }
}
