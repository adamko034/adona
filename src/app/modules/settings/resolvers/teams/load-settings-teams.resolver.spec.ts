import { LoadSettingsTeamsResolver } from 'src/app/modules/settings/resolvers/teams/load-settings-teams.resolver';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Load Settings Teams Resolver', () => {
  let resolver: LoadSettingsTeamsResolver;

  const { settingsFacade } = SpiesBuilder.init().withSettingsFacade().build();

  beforeEach(() => {
    resolver = new LoadSettingsTeamsResolver(settingsFacade);
  });

  describe('Can Activate', () => {
    it('should invoke Load Teams and return true', () => {
      expect(resolver.canActivate()).toBeTrue();
      expect(settingsFacade.loadTeams).toHaveBeenCalledTimes(1);
    });
  });
});
