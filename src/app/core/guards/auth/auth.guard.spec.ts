import { TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { AuthService } from './../../../shared/services/auth/auth.service';
import { AuthGuard } from './auth.guard';
import { NavigationService } from '../../../shared/services/navigation/navigation.service';

describe('AuthGuard', () => {
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['authState$']);
  const navigationServiceSpy = jasmine.createSpyObj('NavigationService', [
    'toLogin'
  ]);

  let navigationServiceMock;
  let authServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: NavigationService, useValue: navigationServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
  });

  beforeEach(() => {
    authServiceMock = TestBed.get(AuthService);
    navigationServiceMock = TestBed.get(NavigationService);
  });

  it('should create guard', () => {
    // when
    const guard = new AuthGuard(authServiceMock, navigationServiceMock);

    // then
    expect(guard).toBeTruthy();
  });

  it('should return false and redirect to login page', () => {
    // given
    authServiceMock.authState$ = of(null);

    // when
    const guard = new AuthGuard(authServiceMock, navigationServiceMock);
    const result: Observable<boolean> = guard.canActivate();

    // then
    result.subscribe(res => expect(res).toBeFalsy());
    expect(navigationServiceMock.toLogin).toHaveBeenCalledTimes(1);
  });

  it('should return true', () => {
    // given
    authServiceMock.authState$ = of({ state: true });

    // when
    const guard = new AuthGuard(authServiceMock, navigationServiceMock);
    const result: Observable<boolean> = guard.canActivate();

    // then
    result.subscribe(res => expect(res).toBeTruthy());
  });
});
