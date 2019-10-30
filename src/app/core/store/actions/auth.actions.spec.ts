import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import {
  AuthActionTypes,
  AuthenticatedAction,
  AuthRequestedAction,
  LoginAction,
  LogoutAction,
  NotAuthenitcatedAction
} from './auth.actions';

describe('Auth Actions', () => {
  const credentials: CredentialsLogin = {
    email: 'test@test.com',
    password: 'test'
  };

  it('should create login action', () => {
    // when
    const action = new LoginAction(credentials);

    // then
    expect({ ...action }).toEqual({
      type: AuthActionTypes.Login,
      payload: credentials
    });
  });

  it('should create logout action', () => {
    // when
    const action = new LogoutAction();

    // then
    expect({ ...action }).toEqual({ type: AuthActionTypes.Logout });
  });

  it('should create get auth action', () => {
    // when
    const action = new AuthRequestedAction();

    // then
    expect({ ...action }).toEqual({ type: AuthActionTypes.AuthRequested });
  });

  it('should create authenicated action', () => {
    // given
    const user = new UserTestBuilder().withDefaultData().build();

    // when
    const action = new AuthenticatedAction(user);

    // then
    expect({ ...action }).toEqual({
      type: AuthActionTypes.Authenticated,
      payload: user
    });
  });

  it('should create not authenitcated action', () => {
    // when
    const action = new NotAuthenitcatedAction();

    // then
    expect({ ...action }).toEqual({
      type: AuthActionTypes.NotAuthenticated
    });
  });
});
