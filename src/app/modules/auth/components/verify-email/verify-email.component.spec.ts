import { of, Subject, throwError } from 'rxjs';
import { SpiesBuilder } from '../../../../utils/testUtils/builders/spies.builder';
import { VerifyEmailComponent } from './verify-email.component';

describe('Verify Email Component', () => {
  let component: VerifyEmailComponent;

  const { authFacade } = SpiesBuilder.init()
    .withAuthFacade()
    .build();

  beforeEach(() => {
    component = new VerifyEmailComponent(authFacade);
  });

  describe('Constructor', () => {
    it('should default flags to false', () => {
      expect(component.showError).toBeFalsy();
      expect(component.showLoader).toBeFalsy();
      expect(component.emailSent).toBeFalsy();
    });
  });

  describe('On Init', () => {
    it('should default flags to false', () => {
      expect(component.showError).toBeFalsy();
      expect(component.showLoader).toBeFalsy();
      expect(component.emailSent).toBeFalsy();
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
      authFacade.sendEmailConfirmationLink.and.returnValue(of(null));

      component.resendConfirmationLink();

      expect(component.showLoader).toBeFalsy();
      expect(component.showError).toBeFalsy();
      expect(component.emailSent).toBeTruthy();
    });

    it('should set flags if email has not been sent', () => {
      authFacade.sendEmailConfirmationLink.and.returnValue(throwError('err'));

      component.resendConfirmationLink();

      expect(component.showLoader).toBeFalsy();
      expect(component.showError).toBeTruthy();
      expect(component.emailSent).toBeFalsy();
    });
  });
});
