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
      component.newName.setErrors(null);
      userFacade.selectUser.and.returnValue(cold('a', { a: null }));
    });

    it('should subscribe for user and backend state', () => {
      component.ngOnInit();

      expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
    });

    describe('User Subscription', () => {
      it('should set user and New Name control value', () => {
        const user = UserTestBuilder.withDefaultData().build();
        userFacade.selectUser.and.returnValue(of(user));

        component.ngOnInit();

        expect(component.user).toEqual(user);
        expect(component.newName.value).toEqual(user.name);
      });
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe for all subscriptions', () => {
      component.ngOnDestroy();

      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Name Changed', () => {
    it('should update name when New Name control is valid', () => {
      component.user = UserTestBuilder.withDefaultData().build();
      component.newName.setValue('example');

      component.onNameChanged();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userFacade.updateName, 1, component.user.id, 'example');
    });

    it('should not update name when New Name control is invalid', () => {
      component.user = UserTestBuilder.withDefaultData().build();
      component.newName.setValue('  ');

      component.onNameChanged();

      expect(userFacade.updateName).not.toHaveBeenCalled();
    });
  });
});
