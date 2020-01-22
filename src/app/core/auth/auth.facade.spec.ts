import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { MapperService } from 'src/app/core/services/mapper/mapper.service';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { authActions } from '../store/actions/auth.actions';
import { AuthState } from '../store/reducers/auth/auth.reducer';
import { authQueries } from '../store/selectors/auth.selectors';
import { AuthFacade } from './auth.facade';
import { CredentialsLogin } from './model/credentials-login.model';

describe('Auth Facade', () => {
  const mapperSpy = {
    Users: jasmine.createSpyObj('Users', ['toUser'])
  };

  const initialAuthState: AuthState = {
    loggedIn: false,
    loginFailed: false,
    user: null
  };

  let mapper: any;
  let store: MockStore<AuthState>;
  let facade: AuthFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: initialAuthState }), { provide: MapperService, useValue: mapperSpy }]
    });

    mapper = TestBed.get<MapperService>(MapperService);
    store = TestBed.get<Store<AuthState>>(Store);

    facade = new AuthFacade(store, mapper);
    expect(facade).toBeTruthy();
  });

  it('should dispach AuthenticatedAction on authenticate', () => {
    // given
    const spy = spyOn(store, 'dispatch');
    const userTestBuilder = new UserTestBuilder();

    const user = userTestBuilder.withDefaultData().build();
    const firebaseUser = userTestBuilder.withDefaultData().buildFirebaseUser();

    mapper.Users.toUser.and.returnValue(user);

    // when
    facade.authenticate(firebaseUser);

    // then
    expect(mapper.Users.toUser).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(authActions.authenitcated({ firebaseUser: user }));
  });

  it('should get is logged in status', () => {
    // given
    store.overrideSelector(authQueries.selectLoggedIn, true);

    // when
    const result = facade.isLoggedIn();

    // then
    expect(result).toBeObservable(cold('a', { a: true }));
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

  it('should dispatch Login Action on login', () => {
    // given
    const credentials: CredentialsLogin = {
      email: 'jon@example.com',
      password: 'Password-01'
    };

    const spy = spyOn(store, 'dispatch');

    // when
    facade.login(credentials);

    // then
    expect(spy).toHaveBeenCalledTimes(1);
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
