import { ErrorTestDataBuilder } from 'src/app/core/error/utils/test/error-test-data.builder';
import { teamsActions } from 'src/app/core/team/store/actions';
import { TeamsTestDataBuilder } from 'src/app/core/team/utils/jasmine/teams-test-data.builder';

const types = {
  loadTeamRequested: '[Selected Team Loaded Guard] Load Selected Team Requested',
  loadTeamSuccess: '[Database API] Load Selected Team Success',
  loadTeamFailure: '[Database API] Load Seelcted Team Failure'
};

describe('Selected Team Actions', () => {
  it('should create Load Team Requested', () => {
    expect(teamsActions.team.loadTeamRequested({ id: '123' })).toEqual({
      id: '123',
      type: types.loadTeamRequested
    });
  });

  it('should create Load Team Success', () => {
    const team = TeamsTestDataBuilder.withDefaultData().buildOne();
    expect(teamsActions.team.loadTeamSuccess({ team })).toEqual({
      team,
      type: types.loadTeamSuccess
    });
  });

  it('should create Load Team Failure', () => {
    const error = ErrorTestDataBuilder.from().withDefaultData().build();
    expect(teamsActions.team.loadTeamFailure({ error })).toEqual({
      error,
      type: types.loadTeamFailure
    });
  });
});
