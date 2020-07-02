import { cold } from 'jasmine-marbles';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { HandleUserInvitationGuard } from 'src/app/core/user/guards/user-has-invitation/handle-user-invitation.guard';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('User Has Invitation Guard', () => {
  let guard: HandleUserInvitationGuard;
  const { userFacade, teamFacade } = SpiesBuilder.init().withTeamFacade().withUserFacade().build();

  beforeEach(() => {
    guard = new HandleUserInvitationGuard(userFacade, teamFacade);

    userFacade.selectUser.calls.reset();
    teamFacade.selectTeam.calls.reset();
    userFacade.handleInvitation.calls.reset();
  });

  describe('Can Activate', () => {
    it('should wait for user and team and then handle invitation', () => {
      const user = UserTestBuilder.withDefaultData().withInvitationId('123').build();
      const team = TeamBuilder.from('1', new Date(), user.name, 'team 1', []).build();

      userFacade.selectUser.and.returnValue(cold('----a', { a: user }));
      teamFacade.selectTeam.and.returnValue(cold('----------a', { a: team }));

      expect(guard.canActivate()).toBeObservable(cold('----------a', { a: true }));
      expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
      expect(teamFacade.selectTeam).toHaveBeenCalledTimes(1);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userFacade.handleInvitation, 1, user);
    });

    it('should wait for user and team and then not handle invitation when id not set', () => {
      const user = UserTestBuilder.withDefaultData().withInvitationId(null).build();
      const team = TeamBuilder.from('1', new Date(), user.name, 'team 1', []).build();

      userFacade.selectUser.and.returnValue(cold('----a', { a: user }));
      teamFacade.selectTeam.and.returnValue(cold('----------a', { a: team }));

      expect(guard.canActivate()).toBeObservable(cold('----------a', { a: true }));
      expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
      expect(teamFacade.selectTeam).toHaveBeenCalledTimes(1);
      expect(userFacade.handleInvitation).not.toHaveBeenCalled();
    });
  });
});
