import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { SpiesBuilder } from '../../utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from '../../utils/testUtils/builders/user-test-builder';
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

  const { authService } = SpiesBuilder.init()
    .withAuthService()
    .build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: initialAuthState })]
    });
    store = TestBed.get<Store<AuthState>>(Store);

    facade = new AuthFacade(store, authService);
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

  describe('Send Email Confirmation Link', () => {
    it('should send email if auth state is set', () => {
      const firebaseUser = UserTestBuilder.withDefaultData().buildFirebaseUser();
      const sendEmailSpy = spyOn(firebaseUser, 'sendEmailVerification');

      authService.getAuthState.and.returnValue(of(firebaseUser));

      facade.sendEmailConfirmationLink().subscribe();

      expect(sendEmailSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw error if auth state is not set', () => {
      authService.getAuthState.and.returnValue(of(null));

      const result = facade.sendEmailConfirmationLink();

      expect(result).toBeObservable(cold('#', null, new Error('Auth not set')));
    });
  });
});
