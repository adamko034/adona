import { of } from 'rxjs';
import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { SettingsTeamComponent } from 'src/app/modules/settings/components/teams/settings-team/settings-team.component';
import { DateFormat } from 'src/app/shared/services/time/model/date-format.enum';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Settings Team Component', () => {
  let component: SettingsTeamComponent;

  const {
    teamFacade,
    routerFacade,
    apiRequestsFacade
  } = SpiesBuilder.init().withApiRequestsFacade().withTeamFacade().withRouterFacade().build();

  beforeEach(() => {
    component = new SettingsTeamComponent(teamFacade, routerFacade, apiRequestsFacade);
  });

  describe('On Init', () => {
    it('should set component data', (done) => {
      const team = TeamBuilder.from('1', new Date(), 'user 1', 'team 1', []).build();
      const requestStatus = ApiRequestStatusBuilder.start('test');
      routerFacade.selectRouteParams.and.returnValue(of({ id: team.id }));
      teamFacade.selectTeam.and.returnValue(of(team));
      apiRequestsFacade.selectApiRequest.and.returnValue(of(requestStatus));

      component.ngOnInit();

      component.data$.subscribe((data) => {
        expect(data).toEqual({
          team,
          dateFormat: DateFormat.DayMonthYear,
          requestStatus
        });

        expect(routerFacade.selectRouteParams).toHaveBeenCalledTimes(1);
        expect(teamFacade.selectTeam).toHaveBeenCalledTimes(1);
        expect(teamFacade.selectTeam).toHaveBeenCalledWith(team.id);
        expect(apiRequestsFacade.selectApiRequest).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });
});
