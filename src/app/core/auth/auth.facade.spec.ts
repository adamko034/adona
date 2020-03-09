import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { authActions } from '../store/actions/auth.actions';
import { AuthState } from '../store/reducers/auth/auth.reducer';
import { authQueries } from '../store/selectors/auth.selectors';
import { AuthFacade } from './auth.facade';
import { CredentialsLogin } from './model/credentials-login.model';

describe('Auth Facade', () => {
  const initialAuthState: AuthState = {
    loginFailed: false,
    user: null
  };

  let store: MockStore<AuthState>;
  let facade: AuthFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: initialAuthState })]
    });
    store = TestBed.get<Store<AuthState>>(Store);

    facade = new AuthFacade(store);
  });

  it('should get login failure status', () => {
    // given
    store.overrideSelector(authQueries.selectLoginFailure, true);
    const expected = cold('a', { a: true });

    // when
    const actual$ = facade.getLoginFailure();

    // then
    expect(actual$).toBeObservable(expected);
  });

  it('should dispatch both Login Clear Error and Login actions on login', () => {
    // given
    const credentials: CredentialsLogin = {
      email: 'jon@example.com',
      password: 'Password-01'
    };

    const spy = spyOn(store, 'dispatch');

    // when
    facade.login(credentials);

    // then
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(authActions.loginClearError());
    expect(spy).toHaveBeenCalledWith(authActions.login({ credentials }));
  });

  it('should dispatch Logout Action on logout', () => {
    const spy = spyOn(store, 'dispatch');

    // when
    facade.logout();

    // then
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(authActions.logout());
  });
});
