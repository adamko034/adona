import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { LoginAction } from '../actions/auth.actions';
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

  it('should work', () => {
    authService.login = () => Promise.resolve();

    const action = new LoginAction({ email: 'test', password: 'testPwd' });
    authService.login = actions$ = hot('--a-', { a: action });
    const expected = cold('--b', { b: action });

    expect(effects.logIn$).toBeObservable(expected);
  });
});
