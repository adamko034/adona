import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, noop, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { LoginAction, GetAuthAction } from '../actions/auth.actions';
import { AuthEffects } from './auth.effects';

describe('Auth Effects', () => {
  let effects: AuthEffects;
  let actions$: Observable<Action>;
  let navigationService;
  let authService;

  const navigationServiceSpy = jasmine.createSpyObj('NavigationService', [
    'toHome'
  ]);
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

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

  it('should ', () => {
    authService.login = () => of(noop);
    navigationService.toHome = () => noop;

    const action = new LoginAction({ email: 'test', password: 'testPwd' });
    const completion = new GetAuthAction();
    actions$ = hot('--a', { a: action });
    const expected = cold('--b', { b: completion });

    expect(effects.logIn$).toBeObservable(expected);
    expect(authService.login).toHaveBeenCalledTimes(1);
    expect(navigationService.toHome).toHaveBeenCalledTimes(1);
  });
});
