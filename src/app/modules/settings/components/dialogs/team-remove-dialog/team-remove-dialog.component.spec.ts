import { TeamRemoveDialogData } from 'src/app/modules/settings/components/dialogs/team-remove-dialog/model/team-remove-dialog-data.model';
import { TeamRemoveDialogComponent } from 'src/app/modules/settings/components/dialogs/team-remove-dialog/team-remove-dialog.component';
import { DialogAction } from 'src/app/shared/enum/dialog-action.enum';
import { DialogResult } from 'src/app/shared/services/dialogs/dialog-result.model';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Team Remove Dialog Component', () => {
  let component: TeamRemoveDialogComponent;
  const data: TeamRemoveDialogData = { teamName: 'test team' };

  const { matDialogRef } = SpiesBuilder.init().withMatDialogRef().build();

  beforeEach(() => {
    component = new TeamRemoveDialogComponent(data, matDialogRef);

    matDialogRef.close.calls.reset();
  });

  describe('On Team Name Change', () => {
    ['testteam', 'test team 2', 'Test Team', '', '  ', 'test team'].forEach((newName) => {
      it(`should set flag to ${newName === data.teamName} if new team name is: ${newName}`, () => {
        component.onTeamNameChange(newName);
        expect(component.teamNameConfirmed).toEqual(newName === data.teamName);
      });
    });
  });

  describe('On Team Name Blur', () => {
    it('should set/unset input error', () => {
      expect(component.teamNameFormControl.hasError('notEqual')).toBeFalse();

      component.teamNameConfirmed = false;
      component.onTeamNameBlur();
      expect(component.teamNameFormControl.hasError('notEqual')).toBeTrue();

      component.teamNameConfirmed = true;
      component.onTeamNameBlur();
      expect(component.teamNameFormControl.hasError('notEqual')).toBeFalse();
    });
  });

  describe('Confirm', () => {
    it('should close with Confirm action', () => {
      component.confirm();

      const result: DialogResult<null> = { action: DialogAction.Confirm };
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(matDialogRef.close, 1, result);
    });
  });

  describe('Cancel', () => {
    it('should close with Cancle action', () => {
      component.cancel();

      const result: DialogResult<null> = { action: DialogAction.Cancel };
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(matDialogRef.close, 1, result);
    });
  });
});
