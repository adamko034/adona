import { of } from 'rxjs';
import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { SettingsTeamsComponent } from 'src/app/modules/settings/components/teams/settings-teams/settings-teams.component';
import { DateFormat } from 'src/app/shared/services/time/model/date-format.enum';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Settings Teams Component', () => {
  let component: SettingsTeamsComponent;

  const {
    settingsFacade,
    unsubscriberService,
    apiRequestsFacade
  } = SpiesBuilder.init().withSettingsFacade().withUnsubscriberService().withApiRequestsFacade().build();

  beforeEach(() => {
    component = new SettingsTeamsComponent(settingsFacade, unsubscriberService, apiRequestsFacade);
  });

  describe('Constructor', () => {
    it('should create unsubscriber', () => {
      unsubscriberService.create.calls.reset();
      component = new SettingsTeamsComponent(settingsFacade, unsubscriberService, apiRequestsFacade);
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
      settingsFacade.selectTeams.calls.reset();
      apiRequestsFacade.selectApiRequest.calls.reset();

      const team = TeamBuilder.from('1', new Date(), 'user 1', 'team 1', []).build();
      const request = ApiRequestStatusBuilder.start('id1');

      settingsFacade.selectTeams.and.returnValue(of([team]));
      apiRequestsFacade.selectApiRequest.and.returnValue(of(request));

      component.ngOnInit();

      expect(component.data).toEqual({
        teams: [team],
        requestStatus: request,
        dateFormat: DateFormat.DayMonthYear
      });
    });
  });
});
