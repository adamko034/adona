import { User } from 'src/app/core/auth/model/user-model';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/UserTestBuilder';
import { AuthenticatedAction, NotAuthenitcatedAction } from '../../actions/auth.actions';
import { authReducer, initialAuthState } from './auth.reducer';

describe('Auth Reducer', () => {
  let user: User;

  beforeAll(() => {
    user = new UserTestBuilder().withDefaultData().build();
  });

  describe('an incorrect action', () => {
    it('should return the previous state for unknown action when user is not logged in', () => {
      // given
      const action = {} as any;

      // when
      const result = authReducer(initialAuthState, action);

      // then
      expect(result).toBe(initialAuthState);
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
      expect(result).toBe(initialAuthState);
    });
  });

  describe('authenticated action', () => {
    it('should set logged in and user data', () => {
      // given
      const action = new AuthenticatedAction(user);

      // when
      const result = authReducer(initialAuthState, action);

      // then
      expect(result.loggedIn).toBeTruthy();
      expect(result.user).toBe(user);
    });
  });

  describe('not authenitcated action', () => {
    it('should unset logged in flag and user is empty', () => {
      // given
      const action = new NotAuthenitcatedAction();

      // when
      const result = authReducer(initialAuthState, action);

      // then
      expect(result.loggedIn).toBeFalsy();
      expect(result.user).toBeFalsy();
    });
  });
});
