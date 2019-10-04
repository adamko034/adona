import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { ErrorEffects } from 'src/app/core/store/effects/error.effects';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { ErrorOccuredAction } from '../actions/error.actions';

describe('Error Effects', () => {
  let actions$: Observable<Action>;
  let effects: ErrorEffects;
  const environmentService = jasmine.createSpyObj<EnvironmentService>('environmentService', ['isDev']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorEffects,
        { provide: EnvironmentService, useValue: environmentService },
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<ErrorEffects>(ErrorEffects);
  });

  describe('Error Occured effect', () => {
    it('should log message', () => {
      // given
      environmentService.isDev.and.returnValue(true);

      const action = new ErrorOccuredAction({ error: { message: 'this is message' } });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      // when & then
      expect(effects.errorOccured$).toBeObservable(expected);
      expect(environmentService.isDev).toHaveBeenCalledTimes(1);
    });
  });
});