import { UserTestBuilder } from '../../../utils/testUtils/builders/user-test-builder';
import { Error } from '../../error/model/error.model';
import { ErrorTestDataBuilder } from '../../error/utils/test/error-test-data.builder';
import { ChangeTeamRequest } from '../../team/model/change-team-request.model';
import { userActions, userActionTypes } from './user.actions';

describe('User Actions', () => {
  const user = UserTestBuilder.withDefaultData().build();

  describe('Load User', () => {
    describe('Load User Requested', () => {
      it('should create action', () => {
        const result = userActions.loadUserRequested({ id: '123' });

        expect({ ...result }).toEqual({ type: userActionTypes.loadUserRequested, id: '123' });
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
        const error = ErrorTestDataBuilder.from()
          .withDefaultData()
          .build();
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
          updated: new Date(),
          user
        };

        const result = userActions.changeTeamRequested({ request });

        expect({ ...result }).toEqual({ type: userActionTypes.changeTeamRequested, request });
      });
    });

    describe('Change Team Success', () => {
      it('should create action', () => {
        const props = {
          teamId: '123',
          updated: new Date()
        };

        const result = userActions.changeTeamSuccess({ teamId: props.teamId, updated: props.updated });

        expect({ ...result }).toEqual({
          type: userActionTypes.changeTeamSuccess,
          teamId: props.teamId,
          updated: props.updated
        });
      });
    });

    describe('Change Team Failure', () => {
      it('should create action', () => {
        const error: Error = ErrorTestDataBuilder.from()
          .withDefaultData()
          .build();

        const result = userActions.changeTeamFailure({ error });

        expect({ ...result }).toEqual({ type: userActionTypes.changeTeamFailure, error });
      });
    });
  });

  describe('Team Added', () => {
    it('should create action', () => {
      const request = { id: '123', update: new Date(), name: 'new team' };

      const result = userActions.teamAdded({ id: request.id, name: request.name, updated: request.update });

      expect({ ...result }).toEqual({
        type: userActionTypes.teamAdded,
        id: request.id,
        name: request.name,
        updated: request.update
      });
    });
  });
});
