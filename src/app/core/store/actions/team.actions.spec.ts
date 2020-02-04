import { TeamMembersBuilder } from '../../team/model/builders/team-members.builder';
import { TeamBuilder } from '../../team/model/builders/team.builder';
import { NewTeamRequest } from '../../team/model/new-team-request.model';
import { Team } from '../../team/model/team.model';
import { ErrorTestDataBuilder } from '../../utils/tests/error-test-data.builder';
import { teamActions, teamActionTypes } from './team.actions';

describe('Team Actions', () => {
  const members = TeamMembersBuilder.from()
    .withMember('user 1')
    .withMember('user 2')
    .build();

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

        const result = teamActions.newTeamRequested({ request });

        expect({ ...result }).toEqual({ type: teamActionTypes.newTeamRequested, request });
      });
    });

    describe('New Team Create Success', () => {
      it('should create action', () => {
        const team = TeamBuilder.from('1', new Date(), 'test user', 'example name')
          .withMembers(members)
          .build();

        const result = teamActions.newTeamCreateSuccess({ team });

        expect({ ...result }).toEqual({ type: teamActionTypes.newTeamCreateSuccess, team });
      });
    });

    describe('New Team Create Failure', () => {
      it('should create action', () => {
        const error = ErrorTestDataBuilder.from()
          .withDefaultData()
          .build();

        const result = teamActions.newTeamCreateFailure({ error });

        expect({ ...result }).toEqual({
          type: teamActionTypes.newTeamCreateFailure,
          error
        });
      });
    });
  });

  describe('Load Team', () => {
    describe('Load Selected Team Requested', () => {
      it('should create action', () => {
        const result = teamActions.loadSelectedTeamRequested();

        expect({ ...result }).toEqual({ type: teamActionTypes.loadSelectedTeamRequested });
      });
    });

    describe('Load Team Requested', () => {
      it('should create action', () => {
        const result = teamActions.loadTeamRequested({ id: '123' });

        expect({ ...result }).toEqual({
          type: teamActionTypes.loadTeamRequested,
          id: '123'
        });
      });
    });

    describe('Team Loaded Success', () => {
      it('should create action', () => {
        const team: Team = TeamBuilder.from('1', new Date(), 'test user', 'example team').build();

        const result = teamActions.loadTeamSuccess({ team });

        expect({ ...result }).toEqual({ type: teamActionTypes.loadTeamSuccess, team });
      });
    });

    describe('Team Loaded Failure', () => {
      it('should create action', () => {
        const error = ErrorTestDataBuilder.from()
          .withDefaultData()
          .build();

        const result = teamActions.loadTeamFailure({ error });

        expect({ ...result }).toEqual({ type: teamActionTypes.loadTeamFailure, error });
      });
    });
  });
});
