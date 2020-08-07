import { TestBed } from '@angular/core/testing';
import { RouterReducerState } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { RouteWithParams } from 'src/app/core/router/model/route-with-params.model';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { routerActions } from 'src/app/core/router/store/actions/router.actions';
import { routerQueries } from 'src/app/core/router/store/selectors/router.selectors';

describe('Router Facade', () => {
  let store: MockStore<RouterReducerState>;
  let facade: RouterFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    store = TestBed.inject(MockStore);
    facade = new RouterFacade(store);
  });

  describe('Select Route Params', () => {
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
      expect(facade.selectCurrentRoute()).toBeObservable(cold('a', { a: 'testUrl' }));
    });
  });

  describe('Select Route Query Params', () => {
    it('should return params from store', () => {
      store.overrideSelector(routerQueries.selectRouteQueryParams, { testNumber: 1 });
      expect(facade.selectRouteQueryParams()).toBeObservable(cold('a', { a: { testNumber: 1 } }));
    });
  });

  describe('Select Route Data', () => {
    it('should return data from store', () => {
      const data: { type: string; order: number } = { type: 'test', order: 1 };
      store.overrideSelector(routerQueries.selectData, data);
      expect(facade.selectRouteData<{ type: string; order: number }>()).toBeObservable(cold('a', { a: data }));
    });
  });

  describe('Select Current Route With Params', () => {
    it('should return data from store', () => {
      const route: RouteWithParams = { route: 'url', params: { test: 'test' } };
      store.overrideSelector(routerQueries.currentRouteWithParams, route);
      expect(facade.selectCurrentRouteWithParams()).toBeObservable(cold('a', { a: route }));
    });
  });

  describe('Navigate After Team Deleted', () => {
    it('should dispatch router Team Deleted action', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      facade.navigateAfterTeamDeleted('123');
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(routerActions.teamDeleted({ id: '123' }));
    });
  });
});
