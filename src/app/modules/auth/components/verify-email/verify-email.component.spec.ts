import { of, Subject, throwError } from 'rxjs';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';
import { SpiesBuilder } from '../../../../utils/testUtils/builders/spies.builder';
import { VerifyEmailComponent } from './verify-email.component';

describe('Verify Email Component', () => {
  let component: VerifyEmailComponent;

  const { registrationFacade } = SpiesBuilder.init()
    .withRegistrationFacade()
    .build();

  beforeEach(() => {
    component = new VerifyEmailComponent(registrationFacade);
  });

  describe('Constructor', () => {
    it('should default flags to false', () => {
      JasmineCustomMatchers.toBeFalsy(component.showError, component.showLoader, component.emailSent);
    });
  });

  describe('On Init', () => {
    it('should default flags to false', () => {
      JasmineCustomMatchers.toBeFalsy(component.showError, component.showLoader, component.emailSent);
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe from subscriptions', () => {
      (component as any).emailSentSubscription = new Subject();
      const spy = spyOn((component as any).emailSentSubscription, 'unsubscribe');

      component.ngOnDestroy();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Resend Confirmation Link', () => {
    it('should set flags if email has been sent', () => {
      registrationFacade.resendEmailConfirmationLink.and.returnValue(of(null));

      component.resendConfirmationLink();

      JasmineCustomMatchers.toBeFalsy(component.showLoader, component.showError);
      expect(component.emailSent).toBeTruthy();
    });

    it('should set flags if email has not been sent', () => {
      registrationFacade.resendEmailConfirmationLink.and.returnValue(throwError('err'));

      component.resendConfirmationLink();

      JasmineCustomMatchers.toBeFalsy(component.showLoader, component.emailSent);
      expect(component.showError).toBeTruthy();
    });
  });
});
