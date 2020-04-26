import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';
import { apiRequestActions } from 'src/app/core/store/actions/api-requests.actions';
import { apiRequestQueries } from 'src/app/core/store/selectors/api-requests.selectors';

@Injectable({ providedIn: 'root' })
export class ApiRequestsFacade {
  constructor(private store: Store) {}

  public startRequest(id: string): void {
    this.store.dispatch(apiRequestActions.requestStart({ id }));
  }

  public selectApiRequest(id: string): Observable<ApiRequestStatus> {
    return this.store.pipe(select(apiRequestQueries.selectApiRequest, { id }));
  }
}
