import { User } from 'src/app/core/user/model/user.model';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { DateTestBuilder } from '../../../../utils/testUtils/builders/date-test.builder';
import { UserTeamBuilder } from '../../../user/model/builders/user-team.builder';
import { authActions } from '../../actions/auth.actions';
import { userActions } from '../../actions/user.actions';
import { authInitialState, authReducer } from './auth.reducer';

fdescribe('Auth Reducer', () => {
  let user: User;

  beforeAll(() => {
    user = UserTestBuilder.withDefaultData().build();
  });

  describe('an incorrect action', () => {
    it('should return the previous state for unknown action when user is not logged in', () => {
      // given
      const action = {} as any;

      // when
      const result = authReducer(authInitialState, action);

      // then
      expect(result).toBe(authInitialState);
    });

    it('should return the previous state for unknown action when user is logged in', () => {
      // given
      const action = {} as any;
      const previousState = { loggedIn: true, user, loginFailed: false };

      // when
      const result = authReducer(previousState, action);

      // then
      expect(result).toBe(previousState);
    });

    it('should return default state for undefined action', () => {
      // given
      const action = {} as any;

      // when
      const result = authReducer(undefined, action);

      // then
      expect(result).toBe(authInitialState);
    });
  });

  describe('On Login Success', () => {
    it('should set user and login failed to false', () => {
      const result = authReducer({ user: null, loginFailed: true }, authActions.loginSuccess({ user }));

      expect({ ...result }).toEqual({ user, loginFailed: false });
    });
  });

  describe('On Logout Success', () => {
    it('should set user to null and login failed to false', () => {
      const result = authReducer({ user, loginFailed: true }, authActions.logoutSuccess());

      expect({ ...result }).toEqual({ user: null, loginFailed: false });
    });
  });

  describe('On Load User Success', () => {
    it('should set user', () => {
      const result = authReducer({ user: null, loginFailed: true }, userActions.loadUserSuccess({ user }));

      expect({ ...result }).toEqual({ user, loginFailed: true });
    });
  });

  describe('On Login Failed', () => {
    it('should set user to null and login failed to true', () => {
      const result = authReducer({ user, loginFailed: false }, authActions.loginFailed());

      expect({ ...result }).toEqual({ user: null, loginFailed: true });
    });
  });

  describe('On Change Team Success', () => {
    it('should change user Selected Team Id and change selected team last updated', () => {
      const yesterday = DateTestBuilder.today()
        .addDays(-1)
        .build();
      const userTeam = UserTeamBuilder.from('321', 'test team 1', new Date()).build();
      const userTeamToChange = UserTeamBuilder.from('123', 'test team', yesterday).build();
      const now = new Date();
      const userToChange = UserTestBuilder.withDefaultData()
        .withSelectedTeamId('321')
        .withUserTeam(userTeam)
        .withUserTeam(userTeamToChange)
        .build();
      const userTeamExpected = UserTeamBuilder.from(userTeamToChange.id, userTeamToChange.name, now).build();

      const result = authReducer(
        { user: userToChange, loginFailed: false },
        userActions.changeTeamSuccess({ teamId: userTeamToChange.id, updated: now })
      );

      expect({ ...result }).toEqual({
        loginFailed: false,
        user: {
          id: userToChange.id,
          name: userToChange.name,
          selectedTeamId: '123',
          teams: [userTeam, userTeamExpected]
        }
      });
    });
  });

  describe('On Team Added', () => {
    it('should add team to user when user does not have team assigned', () => {
      const newTeam = UserTeamBuilder.from('123', 'test team', new Date()).build();
      const result = authReducer(
        { user, loginFailed: false },
        userActions.teamAdded({ id: newTeam.id, name: newTeam.name, updated: newTeam.updated })
      );

      expect({ ...result }).toEqual({
        loginFailed: false,
        user: {
          ...user,
          teams: [newTeam]
        }
      });
    });

    it('should add team to user when user has teams', () => {
      const userToChange = UserTestBuilder.withDefaultData()
        .withUserTeam(UserTeamBuilder.from('321', 'team', new Date()).build())
        .build();
      2;
      const newTeam = UserTeamBuilder.from('123', 'test team', new Date()).build();
      const result = authReducer(
        { user: userToChange, loginFailed: false },
        userActions.teamAdded({ id: newTeam.id, name: newTeam.name, updated: newTeam.updated })
      );

      expect({ ...result }).toEqual({
        loginFailed: false,
        user: {
          ...userToChange,
          teams: [...userToChange.teams, newTeam]
        }
      });
    });
  });
});
