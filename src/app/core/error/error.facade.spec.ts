import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ErrorState } from 'src/app/core/store/reducers/error/error.reducer';
import { Store } from '@ngrx/store';
import { errorQueries } from 'src/app/core/store/selectors/error.selectors';
import { cold } from 'jasmine-marbles';
import { ErrorFacade } from 'src/app/core/error/error.facade';

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
      const actual = facade.getErrors();

      // then
      expect(actual).toBeObservable(expected);
    });
  });
});
