import { TestBed } from '@angular/core/testing';
import { RouterReducerState } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { routerQueries } from '../store/selectors/router.selectors';
import { RouterFacade } from './router.facade';

describe('Router Facade', () => {
  let store: MockStore<RouterReducerState>;
  let facade: RouterFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    store = TestBed.get<Store<RouterReducerState>>(Store);
    facade = new RouterFacade(store);
  });

  describe('Get Route Params', () => {
    it('should return observable of params', () => {
      // given
      store.overrideSelector(routerQueries.selectRouteParams, { id: '123' });
      const expected = cold('a', { a: { id: '123' } });

      // when
      const result = facade.selectRouteParams();

      // then
      expect(result).toBeObservable(expected);
    });
  });

  describe('Select Current Route', () => {
    it('should return current route', () => {
      store.overrideSelector(routerQueries.selectCurrentRoute, 'testUrl');
      expect(facade.selectCurrentRute()).toBeObservable(cold('a', { a: 'testUrl' }));
    });
  });

  describe('Select Route Query Params', () => {
    it('should return params from store', () => {
      store.overrideSelector(routerQueries.selectRouteQueryParams, { testNumber: 1 });
      expect(facade.selectRouteQueryParams()).toBeObservable(cold('a', { a: { testNumber: 1 } }));
    });
  });
});
