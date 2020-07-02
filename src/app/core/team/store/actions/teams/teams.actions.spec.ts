import { ErrorTestDataBuilder } from 'src/app/core/error/utils/test/error-test-data.builder';
import { NewTeamMemberBuilder } from 'src/app/core/team/model/new-team-request/new-team-member.builder';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { TeamMemberBuilder } from 'src/app/core/team/model/team-member/team-member.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { allTeamsActions, teamActionTypes } from 'src/app/core/team/store/actions/teams/teams.actions';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';

describe('Team Actions', () => {
  const members = [
    NewTeamMemberBuilder.from('mem1').build(),
    NewTeamMemberBuilder.from('mem2').withEmail('email').build()
  ];
  const request: NewTeamRequest = {
    created: new Date(),
    name: 'team name',
    members
  };

  describe('New Team', () => {
    describe('New Team Requested', () => {
      it('should create action', () => {
        const now = new Date();
        const result = allTeamsActions.newTeamRequested({ request });

        expect({ ...result }).toEqual({ type: teamActionTypes.newTeamRequested, request });
      });
    });

    describe('New Team Create Success', () => {
      it('should create action', () => {
        const user = UserTestBuilder.withDefaultData().build();
        const team = TeamBuilder.from(
          '1',
          new Date(),
          'test user',
          'example name',
          members.map((m) => TeamMemberBuilder.from(m.name, 'url').build())
        ).build();

        const result = allTeamsActions.newTeamCreateSuccess({ id: team.id, user, request });

        expect({ ...result }).toEqual({ type: teamActionTypes.newTeamCreateSuccess, id: team.id, user, request });
      });
    });

    describe('New Team Create Failure', () => {
      it('should create action', () => {
        const error = ErrorTestDataBuilder.from().withDefaultData().build();

        const result = allTeamsActions.newTeamCreateFailure({ error });

        expect({ ...result }).toEqual({
          type: teamActionTypes.newTeamCreateFailure,
          error
        });
      });
    });
  });
});
