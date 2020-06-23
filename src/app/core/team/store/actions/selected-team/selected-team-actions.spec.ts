import { ErrorTestDataBuilder } from 'src/app/core/error/utils/test/error-test-data.builder';
import { teamsActions } from 'src/app/core/team/store/actions';
import { TeamsTestDataBuilder } from 'src/app/core/team/utils/jasmine/teams-test-data.builder';

const types = {
  loadSelectedTeamRequested: '[Selected Team Loaded Guard] Load Selected Team Requested',
  loadSelectedTeamSuccess: '[Database API] Load Selected Team Success',
  loadSelectedTeamFailure: '[Database API] Load Seelcted Team Failure'
};

describe('Selected Team Actions', () => {
  it('should create Load Selected Team Requested', () => {
    expect(teamsActions.selectedTeam.loadSelectedTeamRequested({ id: '123' })).toEqual({
      id: '123',
      type: types.loadSelectedTeamRequested
    });
  });

  it('should create Load Selected Team Success', () => {
    const team = TeamsTestDataBuilder.withDefaultData().buildOne();
    expect(teamsActions.selectedTeam.loadSelectedTeamSuccess({ team })).toEqual({
      team,
      type: types.loadSelectedTeamSuccess
    });
  });

  it('should create Load Selected Team Failure', () => {
    const error = ErrorTestDataBuilder.from().withDefaultData().build();
    expect(teamsActions.selectedTeam.loadSelectedTeamFailure({ error })).toEqual({
      error,
      type: types.loadSelectedTeamFailure
    });
  });
});
