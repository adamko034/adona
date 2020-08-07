import { of } from 'rxjs';
import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { TeamRemoveDialogComponent } from 'src/app/modules/settings/components/dialogs/team-remove-dialog/team-remove-dialog.component';
import { SettingsTeamComponent } from 'src/app/modules/settings/components/teams/settings-team/settings-team.component';
import { DialogAction } from 'src/app/shared/enum/dialog-action.enum';
import { DateFormat } from 'src/app/shared/services/time/model/date-format.enum';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Settings Team Component', () => {
  const user = UserTestBuilder.withDefaultData().build();
  let component: SettingsTeamComponent;

  const {
    teamFacade,
    routerFacade,
    apiRequestsFacade,
    dialogService,
    unsubscriberService,
    userFacade
  } = SpiesBuilder.init()
    .withApiRequestsFacade()
    .withUserFacade()
    .withTeamFacade()
    .withRouterFacade()
    .withDialogService()
    .withUnsubscriberService()
    .build();

  beforeEach(() => {
    component = new SettingsTeamComponent(
      userFacade,
      teamFacade,
      routerFacade,
      apiRequestsFacade,
      dialogService,
      unsubscriberService
    );
  });

  describe('On Init', () => {
    it('should set component data', () => {
      const team = TeamBuilder.from('1', new Date(), 'user 1', 'team 1', []).build();
      const requestStatus = ApiRequestStatusBuilder.start('test');

      userFacade.selectUser.and.returnValue(of(user));
      routerFacade.selectRouteParams.and.returnValue(of({ id: team.id }));
      teamFacade.selectTeam.and.returnValue(of(team));
      apiRequestsFacade.selectApiRequest.and.returnValue(of(requestStatus));

      component.ngOnInit();

      expect(component.data).toEqual({
        team,
        dateFormat: DateFormat.DayMonthYear,
        requestStatus
      });

      expect(routerFacade.selectRouteParams).toHaveBeenCalledTimes(1);
      expect(teamFacade.selectTeam).toHaveBeenCalledTimes(1);
      expect(teamFacade.selectTeam).toHaveBeenCalledWith(team.id);
      expect(apiRequestsFacade.selectApiRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Destroy', () => {
    it('should destroy unsubscriber', () => {
      component.ngOnDestroy();
      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Is Personal Team', () => {
    it('should return correct value', () => {
      component.data = { dateFormat: null, requestStatus: null, team: { id: '123' } as any };
      (component as any).user = { personalTeamId: '123' } as any;

      expect(component.isPersonalTeam()).toBeTrue();

      component.data = { dateFormat: null, requestStatus: null, team: { id: '1234' } as any };
      expect(component.isPersonalTeam()).toBeFalse();
    });
  });

  describe('On Delete Team', () => {
    beforeEach(() => {
      teamFacade.deleteTeam.calls.reset();
      dialogService.open.calls.reset();
    });

    it('should delete team if dialog was confirmed', () => {
      dialogService.open.and.returnValue(of({ action: DialogAction.Confirm }));

      component.data = { team: { id: '1', name: 'test' } as any } as any;
      component.onDeleteTeam();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dialogService.open, 1, TeamRemoveDialogComponent, {
        data: { teamName: 'test' }
      });
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamFacade.deleteTeam, 1, '1');
    });

    it('should not delete team if dialog was cancelled', () => {
      dialogService.open.and.returnValue(of({ action: DialogAction.Cancel }));

      component.data = { team: { name: 'test' } as any } as any;
      component.onDeleteTeam();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dialogService.open, 1, TeamRemoveDialogComponent, {
        data: { teamName: 'test' }
      });
      expect(teamFacade.deleteTeam).not.toHaveBeenCalled();
    });
  });
});
