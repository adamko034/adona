import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { authActions, authActionTypes } from './auth.actions';

describe('Auth Actions', () => {
  const credentials: CredentialsLogin = {
    email: 'test@test.com',
    password: 'test'
  };

  it('should create login action', () => {
    // when
    const action = authActions.login({ credentials });

    // then
    expect({ ...action }).toEqual({
      type: authActionTypes.login,
      credentials
    });
  });

  it('should create logout action', () => {
    // when
    const action = authActions.logout();

    // then
    expect({ ...action }).toEqual({ type: authActionTypes.logout });
  });

  it('should create auth requested action', () => {
    // when
    const action = authActions.authRequested();

    // then
    expect({ ...action }).toEqual({ type: authActionTypes.authRequested });
  });

  it('should create authenicated action', () => {
    // given
    const user = new UserTestBuilder().withDefaultData().build();

    // when
    const action = authActions.authenitcated({ firebaseUser: user });

    // then
    expect({ ...action }).toEqual({
      type: authActionTypes.authenticated,
      user
    });
  });

  it('should create not authenitcated action', () => {
    // when
    const action = authActions.notAuthenticated();

    // then
    expect({ ...action }).toEqual({
      type: authActionTypes.notAuthenticated
    });
  });
});
