import { Subject } from 'rxjs';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';
import { HomeToolbarComponent } from './home-toolbar.component';

fdescribe('Home Toolbar Component', () => {
  let component: HomeToolbarComponent;

  const { dialogService, teamFacade, userUtilsService, userFacade } = SpiesBuilder.init()
    .withDialogService()
    .withTeamFacade()
    .withUserFacade()
    .withUserUtilsService()
    .build();

  beforeEach(() => {
    component = new HomeToolbarComponent(dialogService, teamFacade, userUtilsService, userFacade);

    userUtilsService.hasMultipleTeams.calls.reset();
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
});
