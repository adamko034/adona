import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { authActions, authActionTypes } from './auth.actions';

describe('Auth Actions', () => {
  const credentials: CredentialsLogin = {
    email: 'test@test.com',
    password: 'test'
  };

  const user = UserTestBuilder.withDefaultData().build();

  it('should create login action', () => {
    // when
    const action = authActions.login({ credentials });

    // then
    expect({ ...action }).toEqual({
      type: authActionTypes.login,
      credentials
    });
  });

  it('should create Login Clear Error action', () => {
    // when
    const action = authActions.loginClearError();

    // then
    expect({ ...action }).toEqual({
      type: authActionTypes.loginClearError
    });
  });

  it('should create login success action', () => {
    // when
    const action = authActions.loginSuccess({ user });

    // then
    expect({ ...action }).toEqual({
      type: authActionTypes.loginSuccess,
      user
    });
  });

  it('should create login failed action', () => {
    // when
    const action = authActions.loginFailed();

    // then
    expect({ ...action }).toEqual({
      type: authActionTypes.loginFailed
    });
  });

  it('should create logout action', () => {
    // when
    const action = authActions.logout();

    // then
    expect({ ...action }).toEqual({ type: authActionTypes.logout });
  });

  it('should create logout success action', () => {
    // when
    const action = authActions.logoutSuccess();

    // then
    expect({ ...action }).toEqual({ type: authActionTypes.logoutSucces });
  });
});
