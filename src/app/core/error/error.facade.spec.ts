import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { ErrorFacade } from 'src/app/core/error/error.facade';
import { ErrorState } from 'src/app/core/store/reducers/error/error.reducer';
import { errorQueries } from 'src/app/core/store/selectors/error.selectors';

describe('Error Facade', () => {
  let store: MockStore<ErrorState>;
  let facade: ErrorFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    store = TestBed.get<Store<ErrorState>>(Store);
    facade = new ErrorFacade(store);

    expect(facade).toBeTruthy();
  });

  describe('getErrors', () => {
    it('should return observable of error messages', () => {
      // given
      store.overrideSelector(errorQueries.selectErrorMessage, 'This is error');
      const expected = cold('a', { a: 'This is error' });

      // when
      const actual = facade.selectErrors();

      // then
      expect(actual).toBeObservable(expected);
    });
  });
});
