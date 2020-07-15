import { of } from 'rxjs';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { SettingsTeamsComponent } from 'src/app/modules/settings/components/teams/settings-teams/settings-teams.component';
import { DateFormat } from 'src/app/shared/services/time/model/date-format.enum';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Settings Teams Component', () => {
  let component: SettingsTeamsComponent;

  const {
    teamFacade,
    unsubscriberService,
    apiRequestsFacade,
    userFacade
  } = SpiesBuilder.init().withUserFacade().withTeamFacade().withUnsubscriberService().withApiRequestsFacade().build();

  beforeEach(() => {
    component = new SettingsTeamsComponent(userFacade, teamFacade, unsubscriberService, apiRequestsFacade);
  });

  describe('Constructor', () => {
    it('should create unsubscriber', () => {
      unsubscriberService.create.calls.reset();
      component = new SettingsTeamsComponent(userFacade, teamFacade, unsubscriberService, apiRequestsFacade);
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
      teamFacade.selectTeams.calls.reset();
      apiRequestsFacade.selectApiRequest.calls.reset();

      const userTeams = [{ id: '1', name: 'team 1' }];

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

      userFacade.selectUserTeams.and.returnValue(of(userTeams));
      teamFacade.selectTeams.and.returnValue(of(teams));
      apiRequestsFacade.selectApiRequest.and.returnValue(of(request));

      component.ngOnInit();

      expect(component.data).toEqual({
        teams: expectedTeams,
        requestStatus: request,
        dateFormat: DateFormat.DayMonthYear
      });

      expect(userFacade.selectUserTeams).toHaveBeenCalledTimes(1);
      expect(teamFacade.selectTeams).toHaveBeenCalledTimes(1);
      expect(apiRequestsFacade.selectApiRequest).toHaveBeenCalledTimes(1);
      expect(apiRequestsFacade.selectApiRequest).toHaveBeenCalledWith(apiRequestIds.loadTeams);
    });
  });
});
