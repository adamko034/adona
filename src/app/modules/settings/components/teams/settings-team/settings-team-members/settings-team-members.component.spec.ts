import { SettingsTeamMembersComponent } from 'src/app/modules/settings/components/teams/settings-team/settings-team-members/settings-team-members.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Settings Team Members Component', () => {
  let component: SettingsTeamMembersComponent;

  const { userFacade } = SpiesBuilder.init().withUserFacade().build();

  beforeEach(() => {
    component = new SettingsTeamMembersComponent(userFacade);
  });

  describe('On Init', () => {
    it('should select user id', () => {
      component.ngOnInit();
      expect(userFacade.selectUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Toggle Mode', () => {
    ['display', 'edit'].forEach((mode) => {
      it(`should set Is Edit flag when mode is ${mode}`, () => {
        component.onToggleMode(mode === 'edit' ? 'edit' : 'display');
        expect(component.editMode).toEqual(mode === 'edit');
      });
    });
  });
});
