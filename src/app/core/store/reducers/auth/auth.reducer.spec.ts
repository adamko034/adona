import { authActions } from 'src/app/core/store/actions/auth.actions';
import { userActions } from 'src/app/core/store/actions/user.actions';
import { UserTeamBuilder } from 'src/app/core/user/model/user-team/user-team.builder';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import * as fromReducer from './auth.reducer';

describe('Auth Reducer', () => {
  let user: User;
  const { reducer, authInitialState } = fromReducer;

  beforeAll(() => {
    user = UserTestBuilder.withDefaultData().build();
  });

  describe('an incorrect action', () => {
    it('should return the previous state for unknown action when user is not logged in', () => {
      // given
      const action = {} as any;

      // when
      const result = reducer(authInitialState, action);

      // then
      expect(result).toBe(authInitialState);
    });

    it('should return the previous state for unknown action when user is logged in', () => {
      // given
      const action = {} as any;
      const previousState = { loggedIn: true, user, loginFailed: false };

      // when
      const result = reducer(previousState, action);

      // then
      expect(result).toBe(previousState);
    });

    it('should return default state for undefined action', () => {
      // given
      const action = {} as any;

      // when
      const result = reducer(undefined, action);

      // then
      expect(result).toBe(authInitialState);
    });
  });

  describe('On Login Success', () => {
    it('should set user and login failed to null', () => {
      const result = reducer({ user: null, loginFailed: true }, authActions.loginSuccess({ user }));

      expect({ ...result }).toEqual({ user, loginFailed: null });
    });
  });

  describe('On Logout Success', () => {
    it('should set user to null and login failed to null', () => {
      const result = reducer({ user, loginFailed: true }, authActions.logoutSuccess());

      expect({ ...result }).toEqual({ user: null, loginFailed: null });
    });
  });

  describe('On Load User Success', () => {
    it('should set user', () => {
      const result = reducer({ user: null, loginFailed: false }, userActions.loadUserSuccess({ user }));

      expect({ ...result }).toEqual({ user, loginFailed: false });
    });
  });

  describe('On Login Failed', () => {
    it('should set user to null and login failed to true', () => {
      const result = reducer({ user, loginFailed: false }, authActions.loginFailed());

      expect({ ...result }).toEqual({ user: null, loginFailed: true });
    });
  });

  describe('On Login Clear Error', () => {
    it('should set user and login failed to null', () => {
      const result = reducer({ user, loginFailed: true }, authActions.loginClearError());

      expect({ ...result }).toEqual({ user: null, loginFailed: null });
    });
  });

  describe('On Team Added', () => {
    it('should add team to user when user does not have team assigned', () => {
      const newTeam = UserTeamBuilder.from('123', 'test team').build();
      const userWithoutTeams = { ...user, teams: [] };
      const result = reducer({ user: userWithoutTeams, loginFailed: false }, userActions.teamAdded({ team: newTeam }));

      expect({ ...result }).toEqual({
        loginFailed: false,
        user: {
          ...userWithoutTeams,
          teams: [newTeam]
        }
      });
    });

    it('should add team to user when user has teams', () => {
      const userToChange = UserTestBuilder.withDefaultData()
        .withUserTeam(UserTeamBuilder.from('321', 'team').build())
        .build();

      const newTeam = UserTeamBuilder.from('123', 'test team').build();
      const result = reducer({ user: userToChange, loginFailed: false }, userActions.teamAdded({ team: newTeam }));

      expect({ ...result }).toEqual({
        loginFailed: false,
        user: {
          ...userToChange,
          teams: [...userToChange.teams, newTeam]
        }
      });
    });
  });

  describe('On Update Name Success', () => {
    it('should change user name', () => {
      const currentState: fromReducer.AuthState = {
        loginFailed: false,
        user: UserTestBuilder.withDefaultData().build()
      };

      const result = reducer(currentState, userActions.updateNameSuccess({ newName: 'exampleUser' }));

      expect(result).toEqual({ ...currentState, user: { ...currentState.user, name: 'exampleUser' } });
    });
  });

  describe('On Handle Invitation Success', () => {
    it('should add User Team and unset Invitation Id', () => {
      const action = userActions.handleInvitationSuccess({ teamId: '1', teamName: 'team 1' });
      const currentState: fromReducer.AuthState = {
        loginFailed: false,
        user: UserTestBuilder.withDefaultData().withInvitationId('123').build()
      };

      const result = reducer(currentState, action);

      const expected: fromReducer.AuthState = {
        loginFailed: false,
        user: UserTestBuilder.withDefaultData().withInvitationId(null).build()
      };

      expect(result).toEqual(expected);
    });
  });

  describe('On Handle Invitation Reject', () => {
    it('should unset user Invitation Id', () => {
      const currentState: fromReducer.AuthState = {
        loginFailed: false,
        user: UserTestBuilder.withDefaultData().withInvitationId('123').build()
      };
      const action = userActions.handleInvitationReject();

      const result = reducer(currentState, action);
      const expectedState: fromReducer.AuthState = {
        loginFailed: false,
        user: UserTestBuilder.withDefaultData().withInvitationId(null).build()
      };

      expect(result).toEqual(expectedState);
    });
  });
});
