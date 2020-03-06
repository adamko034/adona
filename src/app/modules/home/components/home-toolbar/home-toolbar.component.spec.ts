import { of, Subject } from 'rxjs';
import { TeamMembersBuilder } from 'src/app/core/team/model/builders/team-members.builder';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request.model';
import { DialogResult } from 'src/app/shared/services/dialogs/dialog-result.model';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';
import { NewTeamDialogComponent } from '../dialogs/new-team-dialog/new-team-dialog.component';
import { HomeToolbarComponent } from './home-toolbar.component';

describe('Home Toolbar Component', () => {
  let component: HomeToolbarComponent;

  const user = UserTestBuilder.withDefaultData().build();

  const { dialogService, teamFacade, userUtilsService, sharedDialogService } = SpiesBuilder.init()
    .withDialogService()
    .withTeamFacade()
    .withSharedDialogService()
    .withUserUtilsService()
    .build();

  beforeEach(() => {
    component = new HomeToolbarComponent(dialogService, teamFacade, userUtilsService, sharedDialogService);
    component.user = user;

    userUtilsService.hasMultipleTeams.calls.reset();
    dialogService.open.calls.reset();
    teamFacade.addTeam.calls.reset();
    teamFacade.loadTeam.calls.reset();
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
    it('should call Shared Dialogs Service', () => {
      sharedDialogService.changeTeam.and.returnValue(of(null));

      component.openChangeTeamDialog();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(sharedDialogService.changeTeam, 1, user);
    });
  });
});
