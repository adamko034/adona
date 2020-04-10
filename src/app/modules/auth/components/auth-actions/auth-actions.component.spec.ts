import { of } from 'rxjs';
import { AuthActionsComponent } from 'src/app/modules/auth/components/auth-actions/auth-actions.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Auth Actions Component', () => {
  let component: AuthActionsComponent;

  const {
    routerFacade,
    unsubscriberService,
    navigationService
  } = SpiesBuilder.init().withRouterFacade().withUnsubscriberService().withNavigationService().build();

  beforeEach(() => {
    component = new AuthActionsComponent(routerFacade, unsubscriberService, navigationService);

    routerFacade.selectRouteQueryParams.calls.reset();
    navigationService.toLogin.calls.reset();
  });

  describe('Contructor', () => {
    it('should create unsubscriber subject', () => {
      unsubscriberService.create.calls.reset();

      component = new AuthActionsComponent(routerFacade, unsubscriberService, navigationService);
      expect(unsubscriberService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Destroy', () => {
    it('should complete unsubscriber', () => {
      component.ngOnDestroy();

      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Init', () => {
    it('should navigate to Reset Password page', () => {
      routerFacade.selectRouteQueryParams.and.returnValue(of({ oobCode: '123', mode: 'resetPassword' }));
      component.ngOnInit();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(navigationService.toResetPassword, 1, '123');
    });

    it('should navigate to Email Verified page', () => {
      routerFacade.selectRouteQueryParams.and.returnValue(of({ oobCode: '123', mode: 'verifyEmail' }));
      component.ngOnInit();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(navigationService.toEmailVerified, 1, '123');
    });

    it('should navigate to Login page when unkown mode', () => {
      routerFacade.selectRouteQueryParams.and.returnValue(of({ oobCode: '123', mode: 'unkownMode' }));
      component.ngOnInit();

      expect(navigationService.toLogin).toHaveBeenCalledTimes(1);
    });

    it('should navigate to Login page when params missing', () => {
      routerFacade.selectRouteQueryParams.and.returnValue(of(null));
      component.ngOnInit();

      expect(navigationService.toLogin).toHaveBeenCalledTimes(1);
    });

    it('should navigate to Login page when oobCode is missing', () => {
      routerFacade.selectRouteQueryParams.and.returnValue(of(of({ mode: 'unkownMode' })));
      component.ngOnInit();

      expect(navigationService.toLogin).toHaveBeenCalledTimes(1);
    });

    it('should navigate to Login page when mode is missing', () => {
      routerFacade.selectRouteQueryParams.and.returnValue(of(of({ oobCode: '123' })));
      component.ngOnInit();

      expect(navigationService.toLogin).toHaveBeenCalledTimes(1);
    });
  });
});
