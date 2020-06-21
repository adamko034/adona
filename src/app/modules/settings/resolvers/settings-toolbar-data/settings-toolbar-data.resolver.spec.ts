import { cold } from 'jasmine-marbles';
import { SettingsPages } from 'src/app/modules/settings/enums/settings-types.enum';
import { SettingsToolbarBuilder } from 'src/app/modules/settings/models/settings-toolbar/settings-toolbar.builder';
import { SettingToollbarDataResolver } from 'src/app/modules/settings/resolvers/settings-toolbar-data/settings-toolbar-data.resolver';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Settings Data Resolver', () => {
  let resolver: SettingToollbarDataResolver;

  const {
    settingsToolbarFactory,
    userFacade
  } = SpiesBuilder.init().withUserFacade().withSettingsToolbarFactory().build();

  beforeEach(() => {
    resolver = new SettingToollbarDataResolver(settingsToolbarFactory, userFacade);

    userFacade.selectUser.calls.reset();
    settingsToolbarFactory.createWithSubtitle.calls.reset();
  });

  describe('Resolve For My Account page', () => {
    it('should create with user email as subtitle', () => {
      const route: any = { data: { type: SettingsPages.MyAccount } };
      const user = UserTestBuilder.withDefaultData().build();
      const data = SettingsToolbarBuilder.from('test', 'testUrl').withSubtitle('subTest').build();

      userFacade.selectUser.and.returnValue(cold('aa-bb', { a: null, b: user }));
      settingsToolbarFactory.createWithSubtitle.and.returnValue(data);

      expect(resolver.resolve(route)).toBeObservable(cold('---(a|)', { a: data }));
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userFacade.selectUser, 1);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        settingsToolbarFactory.createWithSubtitle,
        1,
        SettingsPages.MyAccount,
        user.email
      );
    });
  });

  describe('Resolve for other settings pages', () => {
    it('should create data for teams settings page', () => {
      const expected = SettingsToolbarBuilder.from('test', 'testUrl').build();
      settingsToolbarFactory.create.and.returnValue(expected);

      expect(resolver.resolve({ data: { type: SettingsPages.Teams } } as any)).toEqual(expected);

      expect(userFacade.selectUser).not.toHaveBeenCalled();
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(settingsToolbarFactory.create, 1, SettingsPages.Teams);
    });
  });
});
