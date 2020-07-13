import { LoadSettingsTeamsGuard } from 'src/app/modules/settings/guards/teams/load-settings-teams.guard';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Load Settings Teams Resolver', () => {
  let resolver: LoadSettingsTeamsGuard;

  const { teamFacade } = SpiesBuilder.init().withTeamFacade().build();

  beforeEach(() => {
    resolver = new LoadSettingsTeamsGuard(teamFacade);
  });

  describe('Can Activate', () => {
    it('should invoke Load Teams and return true', () => {
      expect(resolver.canActivate()).toBeTrue();
      expect(teamFacade.loadTeams).toHaveBeenCalledTimes(1);
    });
  });
});
