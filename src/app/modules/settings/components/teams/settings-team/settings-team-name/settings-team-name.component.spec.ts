import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { SettingsTeamNameComponent } from 'src/app/modules/settings/components/teams/settings-team/settings-team-name/settings-team-name.component';

describe('Settings Team Name Component', () => {
  let component: SettingsTeamNameComponent;

  beforeEach(() => {
    component = new SettingsTeamNameComponent();
  });

  describe('On Init', () => {
    it('should set input value based on passed team', () => {
      component.team = TeamBuilder.from('1', new Date(), 'user 1', 'team 1', []).build();
      component.ngOnInit();
      expect(component.teamNameFormControl.value).toEqual('team 1');
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
