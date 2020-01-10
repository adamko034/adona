import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { routerQueries } from '../store/selectors/router.selectors';

@Injectable({ providedIn: 'root' })
export class RouterFacade {
  constructor(private store: Store<RouterReducerState>) {}

  public getRouteParams(): Observable<Params> {
    return this.store.pipe(select(routerQueries.selectRouteParams));
  }
}
