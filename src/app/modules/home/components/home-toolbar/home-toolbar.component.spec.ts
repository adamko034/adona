import { of, Subject } from 'rxjs';
import { TeamMembersBuilder } from 'src/app/core/team/model/builders/team-members.builder';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request.model';
import { DialogResult } from 'src/app/shared/services/dialogs/dialog-result.model';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';
import { ChangeTeamDialogComponent } from '../dialogs/change-team-dialog/change-team-dialog.component';
import { NewTeamDialogComponent } from '../dialogs/new-team-dialog/new-team-dialog.component';
import { HomeToolbarComponent } from './home-toolbar.component';

describe('Home Toolbar Component', () => {
  let component: HomeToolbarComponent;

  const user = UserTestBuilder.withDefaultData().build();

  const { dialogService, teamFacade, userUtilsService, userFacade } = SpiesBuilder.init()
    .withDialogService()
    .withTeamFacade()
    .withUserFacade()
    .withUserUtilsService()
    .build();

  beforeEach(() => {
    component = new HomeToolbarComponent(dialogService, teamFacade, userUtilsService, userFacade);
    component.user = user;

    userUtilsService.hasMultipleTeams.calls.reset();
    dialogService.open.calls.reset();
    teamFacade.addTeam.calls.reset();
    teamFacade.loadTeam.calls.reset();
    userFacade.changeTeam.calls.reset();
  });

  describe('On Destroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      (component as any).newTeamDialogSubscription = new Subject();
      (component as any).changeTeamDialogSubscription = new Subject();

      const newTeamSpy = spyOn((component as any).newTeamDialogSubscription, 'unsubscribe');
      const changeTeamSpy = spyOn((component as any).changeTeamDialogSubscription, 'unsubscribe');

      component.ngOnDestroy();

      expect(newTeamSpy).toHaveBeenCalledTimes(1);
      expect(changeTeamSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('User Has Multiple Teams', () => {
    [true, false].forEach(input => {
      it(`should return ${input}`, () => {
        userUtilsService.hasMultipleTeams.and.returnValue(input);
        component.user = UserTestBuilder.withDefaultData().build();

        expect(component.userHasMultipleTeams()).toEqual(input);
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(userUtilsService.hasMultipleTeams, 1, component.user);
      });
    });
  });

  describe('Open New Team Dialog', () => {
    it('should open New Team Dialog and add team when result is provided', () => {
      const result: DialogResult<NewTeamRequest> = {
        payload: {
          created: new Date(),
          createdBy: user.name,
          members: TeamMembersBuilder.from()
            .withMember(user.name)
            .build(),
          name: 'new team test name'
        }
      };

      dialogService.open.and.returnValue(of(result));

      component.openNewTeamDialog();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dialogService.open, 1, NewTeamDialogComponent, {
        data: { user: user }
      });
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamFacade.addTeam, 1, result.payload);
    });

    it('should open New Team Dialog and add team when result is not provided', () => {
      const result = null;

      dialogService.open.and.returnValue(of(result));

      component.openNewTeamDialog();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dialogService.open, 1, NewTeamDialogComponent, {
        data: { user: user }
      });
      expect(teamFacade.addTeam).not.toHaveBeenCalled();
    });

    it('should open New Team Dialog and add team when result payload is provided', () => {
      const result: DialogResult<NewTeamRequest> = {
        payload: null
      };

      dialogService.open.and.returnValue(of(result));

      component.openNewTeamDialog();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dialogService.open, 1, NewTeamDialogComponent, {
        data: { user: user }
      });
      expect(teamFacade.addTeam).not.toHaveBeenCalled();
    });
  });

  describe('Open Change Team Dialog', () => {
    it('should open dialog and call facades when result provided', () => {
      const result: DialogResult<string> = {
        payload: '867'
      };

      dialogService.open.and.returnValue(of(result));

      component.openChangeTeamDialog();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dialogService.open, 1, ChangeTeamDialogComponent, {
        data: { user }
      });
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userFacade.changeTeam, 1, {
        teamId: result.payload,
        user,
        updated: jasmine.any(Date)
      });
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamFacade.loadTeam, 1, result.payload);
    });

    it('should open dialog and not call facades when result not provided', () => {
      dialogService.open.and.returnValue(of(null));

      component.openChangeTeamDialog();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dialogService.open, 1, ChangeTeamDialogComponent, {
        data: { user }
      });
      expect(teamFacade.loadTeam).not.toHaveBeenCalled();
      expect(userFacade.changeTeam).not.toHaveBeenCalled();
    });

    it('should open dialog and not call facades when result payload is null', () => {
      dialogService.open.and.returnValue(of({ payload: null }));

      component.openChangeTeamDialog();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dialogService.open, 1, ChangeTeamDialogComponent, {
        data: { user }
      });
      expect(teamFacade.loadTeam).not.toHaveBeenCalled();
      expect(userFacade.changeTeam).not.toHaveBeenCalled();
    });
  });
});
