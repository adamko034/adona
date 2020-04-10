import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { ErrorFacade } from 'src/app/core/error/error.facade';
import { errorActions } from 'src/app/core/store/actions/error.actions';
import { ErrorState } from 'src/app/core/store/reducers/error/error.reducer';
import { errorQueries } from 'src/app/core/store/selectors/error.selectors';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Error Facade', () => {
  let store: MockStore<ErrorState>;
  let facade: ErrorFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    store = TestBed.inject(MockStore);
    facade = new ErrorFacade(store);
  });

  describe('Select Error', () => {
    it('should return observable of error message', () => {
      store.overrideSelector(errorQueries.selectErrorMessage, 'This is error');
      const expected = cold('a', { a: 'This is error' });

      const actual = facade.selectError();

      expect(actual).toBeObservable(expected);
    });
  });

  describe('Clear Error', () => {
    it('should dispatch Error Clear action', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      facade.clearError();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dispatchSpy, 1, errorActions.clearError());
    });
  });
});
