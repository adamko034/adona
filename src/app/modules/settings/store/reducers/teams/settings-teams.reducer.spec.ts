import { TeamMemberBuilder } from 'src/app/core/team/model/team-member/team-member.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { settingsActions } from 'src/app/modules/settings/store/actions';
import { reducer, SettingsTeamsState } from 'src/app/modules/settings/store/reducers/teams/settings-teams.reducer';

describe('Settings Teams Reducer', () => {
  it('should add teams', () => {
    const members = [TeamMemberBuilder.from('user 1', 'url').build(), TeamMemberBuilder.from('user 2', 'url2').build()];
    const teams = [
      TeamBuilder.from('1', new Date(), 'user 1', 'team 1', members).build(),
      TeamBuilder.from('2', new Date(), 'user 1', 'team 2', members).build()
    ];
    const expectedState: SettingsTeamsState = {
      ids: ['1', '2'],
      entities: {
        ['1']: teams[0],
        ['2']: teams[1]
      }
    };

    expect(reducer(undefined, settingsActions.teams.loadTeamsSuccess({ teams }))).toEqual(expectedState);
  });
});
