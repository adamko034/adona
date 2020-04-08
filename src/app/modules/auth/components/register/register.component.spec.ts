import { of, Subject } from 'rxjs';
import { CredentialsBuilder } from 'src/app/core/auth/model/builder/credentials.builder';
import { RegisterComponent } from 'src/app/modules/auth/components/register/register.component';
import { registrationErrorCodes } from 'src/app/modules/auth/constants/registration-error-messages.constants';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Register Component', () => {
  let component: RegisterComponent;

  const { registrationFacade, navigationService } = SpiesBuilder.init()
    .withRegistrationFacade()
    .withNavigationService()
    .build();

  beforeEach(() => {
    component = new RegisterComponent(registrationFacade, navigationService);

    registrationFacade.selectRegistrationError.calls.reset();
    registrationFacade.clearRegistrationErrors.calls.reset();
  });

  describe('Constructor', () => {
    it('should set default values', () => {
      component = new RegisterComponent(registrationFacade, navigationService);

      JasmineCustomMatchers.toBeFalsy(component.errorMessage, component.showSpinner);

      expect(component.form.value).toEqual({ email: '', password: '', confirmPassword: '' });
    });
  });

  describe('On Init', () => {
    beforeEach(() => {
      component.showSpinner = true;
    });

    describe('Register Error Subscription', () => {
      it('should handle null error', () => {
        component.errorMessage = 'test';
        registrationFacade.selectRegistrationError.and.returnValue(of(null));

        component.ngOnInit();

        expect(registrationFacade.selectRegistrationError).toHaveBeenCalledTimes(1);
        expect(component.showSpinner).toEqual(false);
        expect(component.errorMessage).toEqual(null);
      });

      it('should handle unkown error', () => {
        registrationFacade.selectRegistrationError.and.returnValue(
          of({ code: registrationErrorCodes.unknown, message: 'unkown error' })
        );

        component.ngOnInit();

        expect(registrationFacade.selectRegistrationError).toHaveBeenCalledTimes(1);
        expect(component.showSpinner).toEqual(false);
        expect(component.errorMessage).toEqual('unkown error');
      });

      it('should handle Email Exists error', () => {
        registrationFacade.selectRegistrationError.and.returnValue(
          of({ code: registrationErrorCodes.emailExists, message: 'email {1} exists' })
        );
        component.form.get('email').setErrors(null);
        component.form.get('email').setValue('exampleUser@email');

        component.ngOnInit();

        expect(registrationFacade.selectRegistrationError).toHaveBeenCalledTimes(1);
        expect(component.showSpinner).toEqual(false);
        expect(component.errorMessage).toEqual('email exampleUser@email exists');
        expect(component.form.get('email').hasError(registrationErrorCodes.emailExists));
      });

      it('should handle Passwords Do Not Match error', () => {
        registrationFacade.selectRegistrationError.and.returnValue(
          of({ code: registrationErrorCodes.passwordsDoNotMatch, message: 'passwords do not match' })
        );
        component.form.get('confirmPassword').setErrors(null);
        component.ngOnInit();

        expect(registrationFacade.selectRegistrationError).toHaveBeenCalledTimes(1);
        expect(component.showSpinner).toEqual(false);
        expect(component.errorMessage).toEqual('passwords do not match');
        expect(component.form.get('confirmPassword').hasError(registrationErrorCodes.passwordsDoNotMatch));
      });
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      (component as any).registrationSubscription = new Subject();
      (component as any).registrationErrorSubscription = new Subject();

      const registrationSpy = spyOn((component as any).registrationSubscription, 'unsubscribe');
      const registrationErrorSpy = spyOn((component as any).registrationErrorSubscription, 'unsubscribe');

      component.ngOnDestroy();

      expect(registrationSpy).toHaveBeenCalledTimes(1);
      expect(registrationErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Register', () => {
    beforeEach(() => {
      registrationFacade.register.calls.reset();
      registrationFacade.pushFormInvalidError.calls.reset();
      registrationFacade.pushPasswordsDoNotMatchError.calls.reset();
      navigationService.toVerifyEmail.calls.reset();

      component.showSpinner = false;
      component.form.setErrors(null);
    });

    it('should push Invalid Form error and not register the user', () => {
      component.form.setErrors({ testError: { valid: false } });

      component.register();

      expect(registrationFacade.clearRegistrationErrors).toHaveBeenCalledTimes(1);
      expect(registrationFacade.pushFormInvalidError).toHaveBeenCalledTimes(1);
      expect(registrationFacade.register).not.toHaveBeenCalled();
      expect(component.showSpinner).toBeFalse();
    });

    it('should push Passwords Do Not Match error and not register the user', () => {
      component.form.get('password').setValue('test');
      component.form.get('confirmPassword').setValue('test2');
      component.form.get('email').setValue('example@example.com');

      component.register();

      expect(registrationFacade.clearRegistrationErrors).toHaveBeenCalledTimes(1);
      expect(registrationFacade.pushPasswordsDoNotMatchError).toHaveBeenCalledTimes(1);
      expect(registrationFacade.register).not.toHaveBeenCalled();
      expect(component.showSpinner).toBeFalse();
    });

    it('should do nothing if registration has failed', () => {
      component.form.get('password').setValue('test');
      component.form.get('confirmPassword').setValue('test');
      component.form.get('email').setValue('example@example.com');

      registrationFacade.register.and.returnValue(of(false));

      component.register();

      expect(component.showSpinner).toEqual(true);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        registrationFacade.register,
        1,
        CredentialsBuilder.from('example@example.com', 'test').build()
      );
      expect(navigationService.toVerifyEmail).not.toHaveBeenCalled();
    });

    it('should register user and navigate to Email Verify page', () => {
      component.form.get('password').setValue('test');
      component.form.get('confirmPassword').setValue('test');
      component.form.get('email').setValue('example@example.com');

      registrationFacade.register.and.returnValue(of(true));

      component.register();

      expect(component.showSpinner).toEqual(false);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        registrationFacade.register,
        1,
        CredentialsBuilder.from('example@example.com', 'test').build()
      );
      expect(navigationService.toVerifyEmail).toHaveBeenCalledTimes(1);
    });
  });
});
