import { ErrorTestDataBuilder } from 'src/app/core/error/utils/test/error-test-data.builder';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { TeamMembersBuilder } from 'src/app/core/team/model/team-member/team-members.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { Team } from 'src/app/core/team/model/team/team.model';
import { allTeamsActions, teamActionTypes } from 'src/app/core/team/store/actions/teams/teams.actions';

describe('Team Actions', () => {
  const members = TeamMembersBuilder.from().withMember('user 1', 'photourl').withMember('user 2', 'photourl').build();

  describe('New Team', () => {
    describe('New Team Requested', () => {
      it('should create action', () => {
        const now = new Date();
        const request: NewTeamRequest = {
          created: now,
          createdBy: 'example',
          name: 'team name',
          members
        };

        const result = allTeamsActions.newTeamRequested({ request });

        expect({ ...result }).toEqual({ type: teamActionTypes.newTeamRequested, request });
      });
    });

    describe('New Team Create Success', () => {
      it('should create action', () => {
        const team = TeamBuilder.from('1', new Date(), 'test user', 'example name').withMembers(members).build();

        const result = allTeamsActions.newTeamCreateSuccess({ team });

        expect({ ...result }).toEqual({ type: teamActionTypes.newTeamCreateSuccess, team });
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

  describe('Load Team', () => {
    describe('Load Team Requested', () => {
      it('should create action', () => {
        const result = allTeamsActions.loadTeamRequested({ id: '123' });

        expect({ ...result }).toEqual({
          type: teamActionTypes.loadTeamRequested,
          id: '123'
        });
      });
    });

    describe('Team Loaded Success', () => {
      it('should create action', () => {
        const team: Team = TeamBuilder.from('1', new Date(), 'test user', 'example team').build();

        const result = allTeamsActions.loadTeamSuccess({ team });

        expect({ ...result }).toEqual({ type: teamActionTypes.loadTeamSuccess, team });
      });
    });

    describe('Team Loaded Failure', () => {
      it('should create action', () => {
        const error = ErrorTestDataBuilder.from().withDefaultData().build();

        const result = allTeamsActions.loadTeamFailure({ error });

        expect({ ...result }).toEqual({ type: teamActionTypes.loadTeamFailure, error });
      });
    });
  });
});
