import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { AuthFacade } from 'src/app/core/auth/auth.facade';
import { NavigationService } from '../../services/navigation/navigation.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const authService = jasmine.createSpyObj('AuthService', ['authState$']);
  const navigationService = jasmine.createSpyObj('NavigationService', ['toLogin']);
  const authFacade = jasmine.createSpyObj('AuthFacade', ['authenticate', 'isLoggedIn']);

  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: NavigationService, useValue: navigationService },
        { provide: AuthService, useValue: authService },
        { provide: AuthFacade, useValue: authFacade }
      ]
    });

    guard = new AuthGuard(authFacade, authService, navigationService);
    authFacade.authenticate.calls.reset();
  });

  it('should return false and redirect to login page', () => {
    // given
    authService.authState$ = of(null);
    authFacade.isLoggedIn.and.returnValue(of(false));

    // when
    const result: Observable<boolean> = guard.canActivate();

    // then
    result.subscribe(res => expect(res).toBeFalsy());
    expect(navigationService.toLogin).toHaveBeenCalledTimes(1);
  });

  it('should return true and not authenticate user', () => {
    // given
    authService.authState$ = of({ state: true });
    authFacade.isLoggedIn.and.returnValue(of(true));

    // when
    const result: Observable<boolean> = guard.canActivate();

    // then
    result.subscribe(res => expect(res).toBeTruthy());
    expect(authFacade.authenticate).not.toHaveBeenCalled();
  });

  it('should return true and authenticate user', () => {
    // given
    authService.authState$ = of({ state: true });
    authFacade.isLoggedIn.and.returnValue(of(false));

    // when
    const result: Observable<boolean> = guard.canActivate();

    // then
    result.subscribe(res => expect(res).toBeTruthy());
    expect(authFacade.authenticate).toHaveBeenCalledTimes(1);
  });
});
