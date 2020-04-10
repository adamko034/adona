import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';
import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';
import { apiRequestActions } from 'src/app/core/store/actions/api-requests.actions';

export interface ApiRequestsState extends EntityState<ApiRequestStatus> {}

const adapter = createEntityAdapter<ApiRequestStatus>();

const apiRequestInitialState = adapter.getInitialState();

const apiRequestsReducer = createReducer(
  apiRequestInitialState,
  on(apiRequestActions.requestStart, (state, action) => {
    const request = ApiRequestStatusBuilder.start(action.id);
    return adapter.upsertOne(request, { ...state });
  }),
  on(apiRequestActions.requestFail, (state, action) => {
    const request = ApiRequestStatusBuilder.fail(action.id, action.errorCode);
    return adapter.upsertOne(request, { ...state });
  }),
  on(apiRequestActions.requestSuccess, (state, action) => {
    const request = ApiRequestStatusBuilder.success(action.id);
    return adapter.upsertOne(request, { ...state });
  })
);

export function reducer(state: ApiRequestsState | undefined, action) {
  return apiRequestsReducer(state, action);
}

export const { selectEntities } = adapter.getSelectors();
