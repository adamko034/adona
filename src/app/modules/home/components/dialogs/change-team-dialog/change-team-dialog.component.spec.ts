import { sortBy } from 'lodash';
import { DateTestBuilder } from 'src/app/utils/testUtils/builders/date-test.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';
import { ChangeTeamDialogComponent } from './change-team-dialog.component';

describe('Change Team Dialog', () => {
  let component: ChangeTeamDialogComponent;
  const user = UserTestBuilder.withDefaultData()
    .withDefaultUserTeams(10)
    .build();

  user.teams[6].name = 'zzz team';
  user.teams[2].updated = DateTestBuilder.now()
    .addDays(-100)
    .build();

  const { matDialogRef } = SpiesBuilder.init()
    .withMatDialogRef()
    .build();

  beforeEach(() => {
    component = new ChangeTeamDialogComponent({ user }, matDialogRef);

    matDialogRef.close.calls.reset();
  });

  describe('On Init', () => {
    it('should set current team id, sort teams and calculate recent teams', () => {
      component.data.user.selectedTeamId = user.teams[0].id;
      const sortedTeams = sortBy([...user.teams], 'name');
      const recentTeams = [user.teams[1], user.teams[3], user.teams[4]];

      component.ngOnInit();

      expect(component.currentTeamId).toEqual(user.selectedTeamId);
      expect(component.sortedTeams).toEqual(sortedTeams);
      expect(component.recentTeams).toEqual(recentTeams);
    });
  });

  describe('On Team Selected', () => {
    it('should close dialog with team id', () => {
      component.onTeamSelected('678');

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(matDialogRef.close, 1, { payload: '678' });
    });
  });

  describe('Is Team Currently Selected', () => {
    [
      { current: '123', new: '123', expected: true },
      { current: '123', new: '12', expected: false }
    ].forEach(input => {
      it(`should return ${input.expected}`, () => {
        component.data.user.selectedTeamId = input.current;

        expect(component.isTeamCurrentlySelected(input.new)).toEqual(input.expected);
      });
    });
  });

  describe('Close', () => {
    it('should close dialog with null result', () => {
      component.close();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(matDialogRef.close, 1, null);
    });
  });
});
