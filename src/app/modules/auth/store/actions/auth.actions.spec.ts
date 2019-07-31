import { UserTestBuilder } from 'src/app/shared/testUtils/builders/UserTestBuilder';
import { CredentialsLogin } from '../../../../shared/models/auth/credentials-login.model';
import { AuthActionTypes, AuthenticatedAction, GetAuthAction, LoginAction, LogoutAction, NotAuthenitcatedAction } from './auth.actions';

describe('Auth NGRX Actions', () => {
  const credentials: CredentialsLogin = {
    email: 'test@test.com',
    password: 'test'
  };

  it('should create login action', () => {
    // when
    const action = new LoginAction(credentials);

    // then
    expect({ ...action }).toEqual({
      type: AuthActionTypes.LoginAction,
      payload: credentials
    });
  });

  it('should create logout action', () => {
    // when
    const action = new LogoutAction();

    // then
    expect({ ...action }).toEqual({ type: AuthActionTypes.LogoutAction });
  });

  it('should create get auth action', () => {
    // when
    const action = new GetAuthAction();

    // then
    expect({ ...action }).toEqual({ type: AuthActionTypes.GetAuthAction });
  });

  it('should create authenicated action', () => {
    // given
    const user = new UserTestBuilder().withDefaultData().build();

    // when
    const action = new AuthenticatedAction(user);

    // then
    expect({ ...action }).toEqual({
      type: AuthActionTypes.AuthenticatedAction,
      payload: user
    });
  });

  it('should create not authenitcated action', () => {
    // when
    const action = new NotAuthenitcatedAction();

    // then
    expect({ ...action }).toEqual({
      type: AuthActionTypes.NotAuthenticatedAction
    });
  });
});
