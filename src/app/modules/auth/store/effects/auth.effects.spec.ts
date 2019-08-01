import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { noop, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { UserTestBuilder } from 'src/app/shared/testUtils/builders/UserTestBuilder';
import { AuthenticatedAction, GetAuthAction, LoginAction, LogoutAction, NotAuthenitcatedAction } from '../actions/auth.actions';
import { AuthEffects } from './auth.effects';
import { MapperService } from '../../../../shared/services/mapper/mapper.service';

describe('Auth Effects', () => {
  let effects: AuthEffects;
  let actions$: Observable<Action>;
  let navigationService;
  let authService;

  const navigationServiceSpy = jasmine.createSpyObj('NavigationService', ['toHome', 'toLogin']);
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'logout', 'authState$']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: NavigationService, useValue: navigationServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    effects = TestBed.get<AuthEffects>(AuthEffects);
    navigationService = TestBed.get<NavigationService>(NavigationService);
    authService = TestBed.get<AuthService>(AuthService);
  });

  describe('log in effect', () => {
    it('should call auth service login method, navigate to home page and result GetAuth action ', () => {
      // given
      authService.login.and.callFake(() => of(noop));
      navigationService.toHome.and.callFake(() => of(noop));

      const action = new LoginAction({ email: 'test', password: 'testPwd' });
      const completion = new GetAuthAction();
      actions$ = hot('--a', { a: action });
      const expected = cold('--b', { b: completion });

      // when & then
      expect(effects.logIn$).toBeObservable(expected);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(navigationService.toHome).toHaveBeenCalledTimes(1);
    });
  });

  describe('get auth effect', () => {
    it('should result in Authenticated action if user is logged in', () => {
      // given
      const firebaseLogin = new UserTestBuilder().withDefaultData().buildFirebaseUser();
      authService.authState$ = of(firebaseLogin);

      const action = new GetAuthAction();
      const completion = new AuthenticatedAction(new MapperService().Users.toUser(firebaseLogin));
      actions$ = hot('--a', { a: action });
      const expected = cold('--b', { b: completion });

      // when & then
      expect(effects.getAuth$).toBeObservable(expected);
    });

    it('should result in Not Authenticated action if user is not logged in', () => {
      // given
      authService.authState$ = of(null);
      const action = new GetAuthAction();
      const completion = new NotAuthenitcatedAction();

      actions$ = hot('--a', { a: action });
      const expected = cold('--b', { b: completion });

      expect(effects.getAuth$).toBeObservable(expected);
    });
  });

  describe('log out effect', () => {
    it('should call auth service logout method, navigate to login page and result in not authenticated action', () => {
      // given
      authService.logout.and.callFake(() => of(noop));
      navigationService.toLogin.and.callFake(() => of(noop));

      const action = new LogoutAction();
      const completion = new NotAuthenitcatedAction();

      actions$ = hot('--a', { a: action });
      const expected = cold('--b', { b: completion });

      // when & then
      expect(effects.logOut$).toBeObservable(expected);
      expect(navigationService.toLogin).toHaveBeenCalledTimes(1);
      expect(authService.logout).toHaveBeenCalledTimes(1);
    });
  });
});
