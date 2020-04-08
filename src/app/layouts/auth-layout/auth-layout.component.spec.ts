import { of, Subject } from 'rxjs';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { AuthLayoutComponent } from './auth-layout.component';

describe('Auth Layout Component', () => {
  let component: AuthLayoutComponent;

  const { routerFacade } = SpiesBuilder.init()
    .withRouterFacade()
    .build();

  beforeEach(() => {
    component = new AuthLayoutComponent(routerFacade);

    routerFacade.selectCurrentRute.calls.reset();
  });

  describe('On Init', () => {
    [
      { route: '/login', expected: 'Login' },
      { route: '/login/register', expected: 'Register' },
      { route: '/login/verifyEmail', expected: 'Email Verification' },
      { route: '/login/resetPassword', expected: 'Forgotten Password' },
      { route: '/login/changePassword', expected: 'Change Password' }
    ].forEach(input => {
      it(`should set title to ${input.expected} for route: ${input.route}`, () => {
        routerFacade.selectCurrentRute.and.returnValue(of(input.route));

        component.ngOnInit();

        expect(routerFacade.selectCurrentRute).toHaveBeenCalledTimes(1);
        expect(component.title).toEqual(input.expected);
      });
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe from subscriptions', () => {
      (component as any).currentRouteSubscription = new Subject();
      const spy = spyOn((component as any).currentRouteSubscription, 'unsubscribe');

      component.ngOnDestroy();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
