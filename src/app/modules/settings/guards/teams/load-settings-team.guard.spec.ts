import { LoadSettingsTeamGuard } from 'src/app/modules/settings/guards/teams/load-settings-team.guard';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Load Settings Team Guard', () => {
  let guard: LoadSettingsTeamGuard;

  const { teamFacade } = SpiesBuilder.init().withTeamFacade().build();

  beforeEach(() => {
    guard = new LoadSettingsTeamGuard(teamFacade);
  });

  describe('Can Activate', () => {
    it('should return false if missing team id param', () => {
      const route = { params: { uid: '1' } } as any;
      expect(guard.canActivate(route)).toEqual(false);
    });

    it('should return true and load team', () => {
      const route = { params: { id: '1' } } as any;
      expect(guard.canActivate(route)).toEqual(true);
      expect(teamFacade.loadTeam).toHaveBeenCalledTimes(1);
      expect(teamFacade.loadTeam).toHaveBeenCalledWith('1');
    });
  });
});
