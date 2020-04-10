import { Dictionary } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';
import * as fromReducer from 'src/app/core/store/reducers/api-requests/api-requests.reducer';

const selectApiRequestsState = createFeatureSelector<fromReducer.ApiRequestsState>('apiRequests');

const selectEntities = createSelector(selectApiRequestsState, fromReducer.selectEntities);
const selectApiRequest = createSelector(
  selectEntities,
  (entities: Dictionary<ApiRequestStatus>, props: { id: string }) => {
    return entities[props.id];
  }
);

export const apiRequestQueries = {
  selectApiRequest
};
