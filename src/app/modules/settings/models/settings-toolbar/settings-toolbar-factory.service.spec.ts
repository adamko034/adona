import { routesN } from 'src/app/core/router/constants/routes.constants';
import { SettingsPages } from 'src/app/modules/settings/enums/settings-types.enum';
import { SettingsToolbarFactory } from 'src/app/modules/settings/models/settings-toolbar/settings-toolbar-factory.service';
import { SettingsToolbar } from 'src/app/modules/settings/models/settings-toolbar/settings-toolbar.model';
import { resources } from 'src/app/shared/resources/resources';

describe('Setting Toolbar Factory', () => {
  let service: SettingsToolbarFactory;

  beforeEach(() => {
    service = new SettingsToolbarFactory();
  });

  describe('Create', () => {
    [SettingsPages.MyAccount, SettingsPages.Teams].forEach((type) => {
      it('should create for type: ' + type, () => {
        const expected: SettingsToolbar = createSettingsToolbar(type);
        const actual = service.create(type);

        expect(actual).toEqual(expected);
      });
    });
  });

  describe('Create With Subtitle', () => {
    it('should create with subtitle', () => {
      const expected = createSettingsToolbar(SettingsPages.MyAccount);
      expected.subtitle = 'test';

      expect(service.createWithSubtitle(SettingsPages.MyAccount, 'test')).toEqual(expected);
    });
  });
});

function createSettingsToolbar(type: SettingsPages): SettingsToolbar {
  const listUrl = routesN.settings.list.url;
  if (type === SettingsPages.MyAccount) {
    return { backButtonUrl: listUrl, title: resources.settings.account.title };
  }

  if (type === SettingsPages.Teams) {
    return { backButtonUrl: listUrl, title: resources.settings.teams.title };
  }
}
