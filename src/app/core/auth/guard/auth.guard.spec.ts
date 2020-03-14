import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { SpiesBuilder } from '../../../utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from '../../../utils/testUtils/builders/user-test-builder';
import { AuthGuard } from './auth.guard';

describe('Auth Guard', () => {
  const { authService, navigationService, userFacade } = SpiesBuilder.init()
    .withUserFacade()
    .withNavigationService()
    .withAuthService()
    .build();

  let guard: AuthGuard;

  beforeEach(() => {
    guard = new AuthGuard(userFacade, authService, navigationService);

    userFacade.selectUser.calls.reset();
    navigationService.toLogin.calls.reset();
    authService.getAuthState.calls.reset();
    userFacade.loadUser.calls.reset();
  });

  it('should return false and redirect to login page if firebase auth state returns null', () => {
    // given
    authService.getAuthState.and.returnValue(hot('a', { a: null }));
    userFacade.selectUser.and.returnValue(of(null));

    // when
    const result: Observable<boolean> = guard.canActivate();

    // then
    expect(result).toBeObservable(cold('(c|)', { c: false }));
    expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
    expect(navigationService.toLogin).toHaveBeenCalledTimes(1);
    expect(authService.getAuthState).toHaveBeenCalledTimes(1);
    expect(userFacade.loadUser).not.toHaveBeenCalled();
  });

  it('should return false and redirect to login page if firebase auth state is set but email not verified', () => {
    // given
    const firebaseUser = UserTestBuilder.withDefaultData().buildFirebaseUser();
    firebaseUser.emailVerified = false;

    authService.getAuthState.and.returnValue(hot('a', { a: firebaseUser }));
    userFacade.selectUser.and.returnValue(of(null));

    // when
    const result: Observable<boolean> = guard.canActivate();

    // then
    expect(result).toBeObservable(cold('(c|)', { c: false }));
    expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
    expect(navigationService.toLogin).toHaveBeenCalledTimes(1);
    expect(authService.getAuthState).toHaveBeenCalledTimes(1);
    expect(userFacade.loadUser).not.toHaveBeenCalled();
  });

  it('should return true and not load user if is already featched', () => {
    // given
    const firebaseUser = UserTestBuilder.withDefaultData().buildFirebaseUser();
    const user = UserTestBuilder.withDefaultData().build();

    authService.getAuthState.and.returnValue(cold('a', { a: firebaseUser }));
    userFacade.selectUser.and.returnValue(of(user));

    // when
    const result: Observable<boolean> = guard.canActivate();

    // then
    expect(result).toBeObservable(cold('(c|)', { c: true }));
    expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
    expect(navigationService.toLogin).not.toHaveBeenCalled();
    expect(userFacade.loadUser).not.toHaveBeenCalled();
    expect(authService.getAuthState).toHaveBeenCalledTimes(1);
  });

  it('should return true and load user', () => {
    // given
    const firebaseUser = UserTestBuilder.withDefaultData().buildFirebaseUser();

    authService.getAuthState.and.returnValue(cold('a', { a: firebaseUser }));
    userFacade.selectUser.and.returnValue(of(null));

    // when
    const result: Observable<boolean> = guard.canActivate();

    // then
    expect(result).toBeObservable(cold('(c|)', { c: true }));
    expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
    expect(userFacade.loadUser).toHaveBeenCalledTimes(1);
    expect(navigationService.toLogin).not.toHaveBeenCalled();
    expect(authService.getAuthState).toHaveBeenCalledTimes(1);
  });
});
