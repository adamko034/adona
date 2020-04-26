import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { SettingsAccountComponent } from 'src/app/modules/settings/components/settings-account/settings-account.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Settings Account Component', () => {
  let component: SettingsAccountComponent;

  const { userFacade, unsubscriberService } = SpiesBuilder.init().withUserFacade().withUnsubscriberService().build();

  beforeEach(() => {
    component = new SettingsAccountComponent(userFacade, unsubscriberService);

    userFacade.selectUser.calls.reset();
    userFacade.updateName.calls.reset();
  });

  describe('Constructor', () => {
    it('should create unsubscriber', () => {
      expect(unsubscriberService.create).toHaveBeenCalled();
    });
  });

  describe('On Init', () => {
    beforeEach(() => {
      userFacade.selectUser.and.returnValue(cold('a', { a: null }));
    });

    it('should subscribe for user', () => {
      component.ngOnInit();

      expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
    });

    describe('User Subscription', () => {
      it('should set user and New Name control value', () => {
        const user = UserTestBuilder.withDefaultData().build();
        userFacade.selectUser.and.returnValue(of(user));

        component.ngOnInit();

        expect(component.user).toEqual(user);
        expect(component.form.get('newName').value).toEqual(user.name);
      });
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe for all subscriptions', () => {
      component.ngOnDestroy();

      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update Name', () => {
    it('should not update name if form is invalid', () => {
      component.form.get('newName').setErrors({ test: { valid: false } });

      component.udpateName();

      expect(userFacade.updateName).not.toHaveBeenCalled();
    });

    it('should update name', () => {
      const user = UserTestBuilder.withDefaultData().build();
      component.form.get('newName').setErrors(null);
      component.form.get('newName').setValue('newUserName');
      component.user = user;

      component.udpateName();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userFacade.updateName, 1, user.id, 'newUserName');
    });
  });
});
