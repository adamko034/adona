import { of } from 'rxjs';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamRemoveDialogComponent } from 'src/app/modules/settings/components/dialogs/team-remove-dialog/team-remove-dialog.component';
import { SettingsTeamsComponent } from 'src/app/modules/settings/components/teams/settings-teams/settings-teams.component';
import { DialogAction } from 'src/app/shared/enum/dialog-action.enum';
import { DateFormat } from 'src/app/shared/services/time/model/date-format.enum';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Settings Teams Component', () => {
  let component: SettingsTeamsComponent;

  const user = UserTestBuilder.withDefaultData().withUserTeams([]).build();

  const {
    teamFacade,
    unsubscriberService,
    apiRequestsFacade,
    userFacade,
    dialogService
  } = SpiesBuilder.init()
    .withDialogService()
    .withUserFacade()
    .withTeamFacade()
    .withUnsubscriberService()
    .withApiRequestsFacade()
    .build();

  beforeEach(() => {
    component = new SettingsTeamsComponent(
      userFacade,
      teamFacade,
      unsubscriberService,
      apiRequestsFacade,
      dialogService
    );
  });

  describe('Constructor', () => {
    it('should create unsubscriber', () => {
      unsubscriberService.create.calls.reset();
      component = new SettingsTeamsComponent(
        userFacade,
        teamFacade,
        unsubscriberService,
        apiRequestsFacade,
        dialogService
      );
      expect(unsubscriberService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Destroy', () => {
    it('should complete unsubscriber', () => {
      unsubscriberService.complete.calls.reset();
      component.ngOnDestroy();
      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Init', () => {
    it('should get all needed data', () => {
      userFacade.selectUser.calls.reset();
      teamFacade.selectTeams.calls.reset();
      apiRequestsFacade.selectApiRequest.calls.reset();

      const teams = [
        TeamBuilder.from('1', new Date(), 'user 1', 'team 1', []).build(),
        TeamBuilder.from('2', new Date(), 'user 1', 'team 2', []).build()
      ];
      const request = ApiRequestStatusBuilder.start('id1');
      const expectedTeams = teams.map((team) => ({
        id: team.id,
        name: team.name,
        created: team.created,
        createdBy: team.createdBy
      }));

      teamFacade.selectTeams.and.returnValue(of(teams));
      apiRequestsFacade.selectApiRequest.and.returnValue(of(request));
      userFacade.selectUser.and.returnValue(of(user));

      component.ngOnInit();

      expect(component.data).toEqual({
        teams: expectedTeams,
        requestStatus: request,
        dateFormat: DateFormat.DayMonthYear
      });

      expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
      expect(teamFacade.selectTeams).toHaveBeenCalledTimes(1);
      expect(apiRequestsFacade.selectApiRequest).toHaveBeenCalledTimes(1);
      expect(apiRequestsFacade.selectApiRequest).toHaveBeenCalledWith(apiRequestIds.loadTeams);
    });
  });

  describe('Is Personal Team', () => {
    it('should return correct flag', () => {
      (component as any).user = { personalTeamId: '123' } as any;
      expect(component.isPersonalTeam('123')).toBeTrue();
      expect(component.isPersonalTeam('1234')).toBeFalse();
    });
  });

  describe('On Delete Team', () => {
    let teamToRemove: Team;

    beforeEach(() => {
      teamFacade.deleteTeam.calls.reset();
      dialogService.open.calls.reset();

      teamToRemove = TeamBuilder.from('1', new Date(), 'user 1', 'team 1', []).build();
    });

    it('should delete team if dialog was confirmed', () => {
      dialogService.open.and.returnValue(of({ action: DialogAction.Confirm }));

      component.onTeamRemove(teamToRemove);

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dialogService.open, 1, TeamRemoveDialogComponent, {
        data: { teamName: teamToRemove.name }
      });
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamFacade.deleteTeam, 1, teamToRemove.id);
    });

    it('should not delete team if dialog was cancelled', () => {
      dialogService.open.and.returnValue(of({ action: DialogAction.Cancel }));

      component.onTeamRemove(teamToRemove);

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dialogService.open, 1, TeamRemoveDialogComponent, {
        data: { teamName: teamToRemove.name }
      });
      expect(teamFacade.deleteTeam).not.toHaveBeenCalled();
    });
  });
});
