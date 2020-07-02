import { Error } from 'src/app/core/error/model/error.model';
import { ErrorTestDataBuilder } from 'src/app/core/error/utils/test/error-test-data.builder';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { InvitationBuilder } from 'src/app/core/invitations/models/invitation/invitation.builder';
import { userActions, userActionTypes } from 'src/app/core/store/actions/user.actions';
import { ChangeTeamRequest } from 'src/app/core/team/model/change-team-requset/change-team-request.model';
import { UserTeamBuilder } from 'src/app/core/user/model/user-team/user-team.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';

describe('User Actions', () => {
  const user = UserTestBuilder.withDefaultData().withDefaultUserTeams(2).build();

  describe('Load User', () => {
    describe('Load User Requested', () => {
      it('should create action', () => {
        const result = userActions.loadUserRequested();

        expect({ ...result }).toEqual({ type: userActionTypes.loadUserRequested });
      });
    });

    describe('Load User Success', () => {
      it('should create action', () => {
        const result = userActions.loadUserSuccess({ user });

        expect({ ...result }).toEqual({ type: userActionTypes.loadUserSuccess, user });
      });
    });

    describe('Load User Failure', () => {
      it('should create action', () => {
        const error = ErrorTestDataBuilder.from().withDefaultData().build();
        const result = userActions.loadUserFailure({ error });

        expect({ ...result }).toEqual({ type: userActionTypes.loadUserFailure, error });
      });
    });
  });

  describe('Change Team', () => {
    describe('Change Team Requested', () => {
      it('should create action', () => {
        const request: ChangeTeamRequest = {
          teamId: '123',
          userId: user.id
        };

        const result = userActions.changeTeamRequested({ request });

        expect({ ...result }).toEqual({ type: userActionTypes.changeTeamRequested, request });
      });
    });

    describe('Change Team Success', () => {
      it('should create action', () => {
        const result = userActions.changeTeamSuccess({ teamId: '123' });

        expect({ ...result }).toEqual({
          type: userActionTypes.changeTeamSuccess,
          teamId: '123'
        });
      });
    });

    describe('Change Team Failure', () => {
      it('should create action', () => {
        const error: Error = ErrorTestDataBuilder.from().withDefaultData().build();

        const result = userActions.changeTeamFailure({ error });

        expect({ ...result }).toEqual({ type: userActionTypes.changeTeamFailure, error });
      });
    });
  });

  describe('Team Added', () => {
    it('should create action', () => {
      const userTeam = UserTeamBuilder.from('1', 'team 1').build();

      const result = userActions.teamAdded({ team: userTeam });

      expect({ ...result }).toEqual({
        type: userActionTypes.teamAdded,
        team: userTeam
      });
    });
  });

  describe('Update Name', () => {
    it('should create Update Name Requested action', () => {
      expect({ ...userActions.updateNameRequested({ id: '1', newName: 'newTest' }) }).toEqual({
        type: userActionTypes.updateNameRequested,
        id: '1',
        newName: 'newTest'
      });
    });

    it('should create Update Name Success action', () => {
      expect({ ...userActions.updateNameSuccess({ newName: 'newTest' }) }).toEqual({
        type: userActionTypes.updateNameSuccess,
        newName: 'newTest'
      });
    });

    it('should create Update Name Failure action', () => {
      const error = ErrorTestDataBuilder.from().withDefaultData().build();
      expect({ ...userActions.updateNameFailure({ error }) }).toEqual({
        type: userActionTypes.updateNameFailure,
        error
      });
    });
  });

  describe('Handle Invitation', () => {
    it('should create Handle Invitation Requested action', () => {
      expect(userActions.handleInvitationRequested({ user })).toEqual({
        type: userActionTypes.handleInvitationRequested,
        user
      });
    });

    it('should create Handle Invitation Success action', () => {
      expect(userActions.handleInvitationSuccess({ teamId: '123', teamName: 'team 123' })).toEqual({
        type: userActionTypes.handleInvitationSuccess,
        teamId: '123',
        teamName: 'team 123'
      });
    });

    it('should create Handle Invitation Failure action', () => {
      const error = ErrorTestDataBuilder.from().withDefaultData().build();
      const toastr = ToastrDataBuilder.from('test', ToastrMode.INFO).build();
      expect(userActions.handleInvitationFailure({ error, toastr })).toEqual({
        type: userActionTypes.handleInvitationFailure,
        error,
        toastr
      });
    });

    it('should create Handle Invitation Accept', () => {
      const invitation = InvitationBuilder.from(
        '123',
        'user2@example.com',
        'user@example.com',
        '123',
        'team 123'
      ).build();
      expect(userActions.handleInvitationAccept({ user, invitation })).toEqual({
        type: userActionTypes.handleInvitationAccept,
        user,
        invitation
      });
    });

    it('should create Handle Invitation Reject', () => {
      expect(userActions.handleInvitationReject()).toEqual({
        type: userActionTypes.handleInvitationReject
      });
    });
  });
});
