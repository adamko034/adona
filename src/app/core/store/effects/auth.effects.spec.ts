import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { UserService } from '../../user/services/user.service';
import { authActions } from '../actions/auth.actions';
import { AuthEffects } from './auth.effects';

describe('Auth Effects', () => {
  let effects: AuthEffects;
  let actions$: Observable<Action>;
  const user = UserTestBuilder.withDefaultData().build();
  const firebaseUser = UserTestBuilder.withDefaultData().buildFirebaseUser();

  const { navigationService, authService, userService } = SpiesBuilder.init()
    .withAuthService()
    .withNavigationService()
    .withUserService()
    .build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: NavigationService, useValue: navigationService },
        { provide: AuthService, useValue: authService },
        { provide: UserService, useValue: userService }
      ]
    });

    effects = TestBed.get<AuthEffects>(AuthEffects);

    authService.login.calls.reset();
    authService.getAuthState.calls.reset();
    navigationService.toHome.calls.reset();
    userService.loadUser.calls.reset();
  });

  describe('Log In', () => {
    it('should login and load user and dispatch Login Success action ', () => {
      // given
      authService.login.and.returnValue(cold('x', { x: { user: firebaseUser } }));
      userService.loadUser.and.returnValue(cold('x', { x: user }));

      const action = authActions.login({ credentials: { email: 'test', password: 'testPwd' } });
      const completion = authActions.loginSuccess({ user });
      actions$ = hot('--a', { a: action });
      const expected = cold('--b', { b: completion });

      // when & then
      expect(effects.logIn$).toBeObservable(expected);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(userService.loadUser).toHaveBeenCalledTimes(1);
    });

    it('should return login failure action when login fails', () => {
      // given
      authService.login.and.returnValue(cold('#'));

      const action = authActions.login({ credentials: { email: 'test', password: 'testPwd' } });
      const completion = authActions.loginFailed();
      actions$ = hot('--a', { a: action });
      const expected = cold('--b', { b: completion });

      // when & then
      expect(effects.logIn$).toBeObservable(expected);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(userService.loadUser).not.toHaveBeenCalled();
    });

    it('should return login failure action when loading user fails', () => {
      // given
      authService.login.and.returnValue(cold('x', { x: { user: firebaseUser } }));
      userService.loadUser.and.returnValue(cold('#'));

      const action = authActions.login({ credentials: { email: 'test', password: 'testPwd' } });
      const completion = authActions.loginFailed();
      actions$ = hot('--a', { a: action });
      const expected = cold('--b', { b: completion });

      // when & then
      expect(effects.logIn$).toBeObservable(expected);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(userService.loadUser).toHaveBeenCalledTimes(1);
    });

    it('should return Email Not Verified action when user has not verified their email', () => {
      // given
      const firebaseUserNotVerfied = { ...firebaseUser, emailVerified: false };
      authService.login.and.returnValue(cold('x', { x: { user: firebaseUserNotVerfied } }));

      const action = authActions.login({ credentials: { email: 'test', password: 'testPwd' } });
      const completion = authActions.emailNotVerified();
      actions$ = hot('--a', { a: action });
      const expected = cold('--b', { b: completion });

      // when & then
      expect(effects.logIn$).toBeObservable(expected);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(userService.loadUser).toHaveBeenCalledTimes(0);
    });
  });

  describe('Log In Success', () => {
    it('should navigate to home', () => {
      actions$ = hot('--a', { a: authActions.loginSuccess({ user }) });

      effects.logInSuccess$.subscribe(() => {
        expect(navigationService.toHome).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Log Out', () => {
    it('should logout user and dispatch Log Out Success action', () => {
      // given
      authService.logout.and.returnValue(cold('x', { x: null }));

      actions$ = hot('--a', { a: authActions.logout() });
      const expected = cold('--b', { b: authActions.logoutSuccess() });

      // when & then
      expect(effects.logOut$).toBeObservable(expected);
      expect(authService.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Logout Success', () => {
    it('should navigate to login page', () => {
      actions$ = hot('a', { a: authActions.logoutSuccess });

      effects.logOutSuccess$.subscribe(() => {
        expect(navigationService.toLogin).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Email Not Verified', () => {
    it('should navigate to Verify Email page', () => {
      actions$ = hot('--a', { a: authActions.emailNotVerified() });

      effects.emailNotVerified$.subscribe(() => {
        expect(navigationService.toVerifyEmail).toHaveBeenCalledTimes(1);
      });
    });
  });
});
