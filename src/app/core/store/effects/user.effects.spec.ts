import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { createAction } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs';
import { SpiesBuilder } from '../../../utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from '../../../utils/testUtils/builders/user-test-builder';
import { DefaultErrorType } from '../../error/enum/default-error-type.enum';
import { ErrorEffectService } from '../../services/store/error-effect.service';
import { ChangeTeamRequest } from '../../team/model/change-team-request.model';
import { UserService } from '../../user/services/user.service';
import { userActions } from '../actions/user.actions';
import { UserEffects } from './user.effects';

describe('User Effects', () => {
  let actions$: Actions;
  let effects: UserEffects;

  const user = UserTestBuilder.withDefaultData().build();

  const { userService, errorEffectService } = SpiesBuilder.init()
    .withUserService()
    .withErrorEffectService()
    .build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        { provide: UserService, useValue: userService },
        { provide: ErrorEffectService, useValue: errorEffectService }
      ]
    });

    effects = TestBed.get<UserEffects>(UserEffects);

    userService.loadUser.calls.reset();
    userService.changeTeam.calls.reset();
  });

  describe('Load User Requested', () => {
    it('should load user and dispatch Load User Success action', () => {
      userService.loadUser.and.returnValue(cold('x', { x: user }));

      actions$ = hot('--a', { a: userActions.loadUserRequested({ id: user.id }) });
      const expected = cold('--b', { b: userActions.loadUserSuccess({ user }) });

      expect(effects.loadUserRequested$).toBeObservable(expected);
      expect(userService.loadUser).toHaveBeenCalledTimes(1);
      expect(userService.loadUser).toHaveBeenCalledWith(user.id);
    });

    it('should dispatch Load User Failure aciton if loading user fails', () => {
      const error = { code: 500 };
      userService.loadUser.and.returnValue(cold('#', {}, error));

      actions$ = hot('--a', { a: userActions.loadUserRequested({ id: user.id }) });
      const expected = cold('--(b|)', { b: userActions.loadUserFailure({ error: { errorObj: error } }) });

      expect(effects.loadUserRequested$).toBeObservable(expected);
      expect(userService.loadUser).toHaveBeenCalledTimes(1);
      expect(userService.loadUser).toHaveBeenCalledWith(user.id);
    });
  });

  describe('Change Team Request', () => {
    it('should change team and dipatch Change Team Success action', () => {
      const request: ChangeTeamRequest = {
        teamId: '123',
        updated: new Date(),
        user
      };
      userService.changeTeam.and.returnValue(cold('x', { x: request }));

      actions$ = hot('--a', { a: userActions.changeTeamRequested({ request }) });
      const expected = cold('--b', {
        b: userActions.changeTeamSuccess({ teamId: request.teamId, updated: request.updated })
      });

      expect(effects.changeTeamRequested$).toBeObservable(expected);
      expect(userService.changeTeam).toHaveBeenCalledTimes(1);
      expect(userService.changeTeam).toHaveBeenCalledWith(request);
    });

    it('should dispatch Change Team Failure action', () => {
      const request: ChangeTeamRequest = {
        teamId: '123',
        updated: new Date(),
        user
      };
      const error = { code: 500 };
      userService.changeTeam.and.returnValue(cold('#', {}, error));

      actions$ = hot('--a', { a: userActions.changeTeamRequested({ request }) });
      const expected = cold('--(b|)', { b: userActions.changeTeamFailure({ error: { errorObj: error } }) });

      expect(effects.changeTeamRequested$).toBeObservable(expected);
      expect(userService.changeTeam).toHaveBeenCalledTimes(1);
      expect(userService.changeTeam).toHaveBeenCalledWith(request);
    });
  });

  it('should create failure effects', () => {
    errorEffectService.createFrom.and.returnValue(of(null));
    errorEffectService.createFrom.calls.reset();

    const actions = new Actions(of(createAction('test action')));

    new UserEffects(actions, userService, errorEffectService);

    expect(errorEffectService.createFrom).toHaveBeenCalledTimes(2);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(
      actions,
      userActions.loadUserFailure,
      DefaultErrorType.ApiGet
    );
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(
      actions,
      userActions.changeTeamFailure,
      DefaultErrorType.ApiOther
    );
  });
});