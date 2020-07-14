import { TeamNameUpdateRequest } from 'src/app/core/team/model/requests/update-name/team-name-update-request.model';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { SettingsTeamNameComponent } from 'src/app/modules/settings/components/teams/settings-team/settings-team-name/settings-team-name.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Settings Team Name Component', () => {
  let component: SettingsTeamNameComponent;

  const { teamFacade } = SpiesBuilder.init().withTeamFacade().build();

  beforeEach(() => {
    component = new SettingsTeamNameComponent(teamFacade);
    component.team = TeamBuilder.from('1', new Date(), 'user 1', 'team 1', []).build();

    teamFacade.changeTeamName.calls.reset();
  });

  describe('On Init', () => {
    it('should set input value based on passed team', () => {
      component.ngOnInit();
      expect(component.teamNameFormControl.value).toEqual('team 1');
    });
  });

  describe('On Toggle Mode', () => {
    ['display', 'edit'].forEach((mode) => {
      it(`should set Is Edit flag when mode is ${mode}`, () => {
        component.teamNameFormControl.setValue('test');

        component.onToggleMode(mode === 'edit' ? 'edit' : 'display');
        expect(component.editMode).toEqual(mode === 'edit');
        expect(component.teamNameFormControl.value).toEqual(component.team.name);
      });
    });
  });

  describe('On Team Name Change', () => {
    it('should call facade if new team name is valid', () => {
      component.teamNameFormControl.setValue('new team name');
      const request: TeamNameUpdateRequest = { id: component.team.id, name: 'new team name' };

      component.onTeamNameChange();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamFacade.changeTeamName, 1, request);
      expect(component.editMode).toBeFalse();
    });

    it('should not call facade if new tem name is invalid', () => {
      component.teamNameFormControl.setValue('   ');

      component.onTeamNameChange();

      expect(teamFacade.changeTeamName).not.toHaveBeenCalled();
    });
  });
});
