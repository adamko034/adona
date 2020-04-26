import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';
import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';
import { apiRequestActions } from 'src/app/core/store/actions/api-requests.actions';
import * as fromReducer from 'src/app/core/store/reducers/api-requests/api-requests.reducer';

describe('Api Requests reducer', () => {
  describe('On Api Request Start', () => {
    it('should add new entity', () => {
      const expected = addApiRequest(emptyState(), ApiRequestStatusBuilder.start('1'));
      const result = fromReducer.reducer(emptyState(), apiRequestActions.requestStart({ id: '1' }));

      expect(result).toEqual(expected);
    });

    it('should update entity', () => {
      let actual = addApiRequest(emptyState(), ApiRequestStatusBuilder.fail('2', null));
      actual = addApiRequest(actual, ApiRequestStatusBuilder.success('1'));

      let expected = addApiRequest(emptyState(), ApiRequestStatusBuilder.fail('2', null));
      expected = addApiRequest(expected, ApiRequestStatusBuilder.start('1'));

      const result = fromReducer.reducer(actual, apiRequestActions.requestStart({ id: '1' }));

      expect(result).toEqual(expected);
    });
  });

  describe('On Request Fail', () => {
    it('should add to state', () => {
      const expected = addApiRequest(emptyState(), ApiRequestStatusBuilder.fail('1', 'testCode'));

      const result = fromReducer.reducer(undefined, apiRequestActions.requestFail({ id: '1', errorCode: 'testCode' }));

      expect(result).toEqual(expected);
    });

    it('should update entity', () => {
      const current = createWithApiRequests([ApiRequestStatusBuilder.start('1'), ApiRequestStatusBuilder.success('2')]);
      const expected = createWithApiRequests([
        ApiRequestStatusBuilder.fail('1', null),
        ApiRequestStatusBuilder.success('2')
      ]);

      const result = fromReducer.reducer(current, apiRequestActions.requestFail({ id: '1', errorCode: null }));

      expect(result).toEqual(expected);
    });
  });

  describe('On Api Request Success', () => {
    it('should add new request to state', () => {
      const current = emptyState();
      const expected = createWithApiRequests([ApiRequestStatusBuilder.success('1')]);

      const result = fromReducer.reducer(current, apiRequestActions.requestSuccess({ id: '1' }));
      expect(result).toEqual(expected);
    });

    it('should update request', () => {
      const current = createWithApiRequests([
        ApiRequestStatusBuilder.fail('1', 'testCode'),
        ApiRequestStatusBuilder.start('2')
      ]);
      const expected = createWithApiRequests([
        ApiRequestStatusBuilder.success('1'),
        ApiRequestStatusBuilder.start('2')
      ]);

      const result = fromReducer.reducer(current, apiRequestActions.requestSuccess({ id: '1' }));
      expect(result).toEqual(expected);
    });
  });
});

function emptyState(): fromReducer.ApiRequestsState {
  const entities: { [id: string]: ApiRequestStatus } = {};
  return { entities, ids: [] };
}

function addApiRequest(state: fromReducer.ApiRequestsState, request: ApiRequestStatus): fromReducer.ApiRequestsState {
  state.entities[request.id] = request;
  state.ids.push(request.id as string & number);

  return { ...state };
}

function createWithApiRequests(requests: ApiRequestStatus[]): fromReducer.ApiRequestsState {
  let state = emptyState();

  requests.forEach((request) => {
    state = addApiRequest(state, request);
  });

  return state;
}
