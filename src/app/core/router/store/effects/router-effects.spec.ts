import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { RouteWithParams } from 'src/app/core/router/model/route-with-params.model';
import { routerActions } from 'src/app/core/router/store/actions/router.actions';
import { RouterEffects } from 'src/app/core/router/store/effects/router.effects';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Router Effects', () => {
  let effects: RouterEffects;
  let actions$: Actions;

  const {
    routerFacade,
    routerLocatorService,
    navigationService
  } = SpiesBuilder.init().withRouterFacade().withRouterLocatorService().withNavigationService().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$)]
    });

    actions$ = TestBed.inject(Actions);
    effects = new RouterEffects(actions$, routerFacade, routerLocatorService, navigationService);
  });

  describe('Team Deleted', () => {
    beforeEach(() => {
      routerLocatorService.isTeamDetailsPage.calls.reset();
      routerFacade.selectCurrentRouteWithParams.calls.reset();
      navigationService.toSettingsTeamsList.calls.reset();
    });

    it('should navigate away if we are on the team details page', () => {
      const action = routerActions.teamDeleted({ id: '123' });
      actions$ = cold('--a--a', { a: action });

      const routeWithParams: RouteWithParams = { params: { id: '123' }, route: 'test' };
      routerFacade.selectCurrentRouteWithParams.and.returnValue(of(routeWithParams));
      routerLocatorService.isTeamDetailsPage.and.returnValue(true);

      expect(effects.teamDeleted$).toBeObservable(cold('--a--a', { a: action }));
      expect(routerFacade.selectCurrentRouteWithParams).toHaveBeenCalledTimes(2);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        routerLocatorService.isTeamDetailsPage,
        2,
        '123',
        routeWithParams
      );
      expect(navigationService.toSettingsTeamsList).toHaveBeenCalledTimes(2);
    });

    it('should not navigate away if we are on different page', () => {
      const action = routerActions.teamDeleted({ id: '123' });
      actions$ = cold('--a--a', { a: action });

      const routeWithParams: RouteWithParams = { params: { id: '123' }, route: 'test' };
      routerFacade.selectCurrentRouteWithParams.and.returnValue(of(routeWithParams));
      routerLocatorService.isTeamDetailsPage.and.returnValue(false);

      expect(effects.teamDeleted$).toBeObservable(cold('--a--a', { a: action }));
      expect(routerFacade.selectCurrentRouteWithParams).toHaveBeenCalledTimes(2);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        routerLocatorService.isTeamDetailsPage,
        2,
        '123',
        routeWithParams
      );
      expect(navigationService.toSettingsTeamsList).not.toHaveBeenCalled();
    });
  });
});
