import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';
import { apiRequestActions } from 'src/app/core/store/actions/api-requests.actions';
import { ApiRequestsState } from 'src/app/core/store/reducers/api-requests/api-requests.reducer';
import { apiRequestQueries } from 'src/app/core/store/selectors/api-requests.selectors';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Api Requests Facade', () => {
  let facade: ApiRequestsFacade;
  let mockStore: MockStore<ApiRequestsState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    mockStore = TestBed.inject(MockStore);
    facade = new ApiRequestsFacade(mockStore);
  });

  describe('Start Request', () => {
    it('should dispach Request Start action', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');
      facade.startRequest('req');
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dispatchSpy, 1, apiRequestActions.requestStart({ id: 'req' }));
    });
  });

  describe('Select Api Request', () => {
    it('should return observable of Api Request Status', () => {
      mockStore.overrideSelector(apiRequestQueries.selectApiRequest, ApiRequestStatusBuilder.start('1'));

      expect(facade.selectApiRequest('1')).toBeObservable(cold('a', { a: ApiRequestStatusBuilder.start('1') }));
    });
  });

  describe('Success Request', () => {
    it('should dispatch Request Success action', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');
      facade.successRequest('req');
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dispatchSpy, 1, apiRequestActions.requestSuccess({ id: 'req' }));
    });
  });
});
