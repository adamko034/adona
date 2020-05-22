import { Credentials } from 'src/app/core/auth/model/credentials.model';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { authActions, authActionTypes } from './auth.actions';

describe('Auth Actions', () => {
  const credentials: Credentials = {
    email: 'test@test.com',
    password: 'test'
  };

  const user = UserTestBuilder.withDefaultData().build();

  it('should create login action', () => {
    const action = authActions.login({ credentials, invitationId: '123' });

    expect({ ...action }).toEqual({
      type: authActionTypes.login,
      credentials,
      invitationId: '123'
    });
  });

  it('should create Login Clear Error action', () => {
    const action = authActions.loginClearError();

    expect({ ...action }).toEqual({
      type: authActionTypes.loginClearError
    });
  });

  it('should create login success action', () => {
    const action = authActions.loginSuccess({ user });

    expect({ ...action }).toEqual({
      type: authActionTypes.loginSuccess,
      user
    });
  });

  it('should create login failed action', () => {
    const action = authActions.loginFailed();

    expect({ ...action }).toEqual({
      type: authActionTypes.loginFailed
    });
  });

  it('should create logout action', () => {
    const action = authActions.logout();

    expect({ ...action }).toEqual({ type: authActionTypes.logout });
  });

  it('should create logout success action', () => {
    const action = authActions.logoutSuccess();

    expect({ ...action }).toEqual({ type: authActionTypes.logoutSucces });
  });

  it('should create email not verified action', () => {
    const action = authActions.emailNotVerified();
    expect({ ...action }).toEqual({ type: authActionTypes.emailNotVerified });
  });
});
