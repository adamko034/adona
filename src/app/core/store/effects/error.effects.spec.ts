import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, noop } from 'rxjs';
import { Action } from '@ngrx/store';
import { ErrorEffects } from 'src/app/core/store/effects/error.effects';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { ErrorOccuredAction } from 'src/app/core/store/actions/error.actions';
import { hot } from 'jasmine-marbles';

fdescribe('Error Effects', () => {
  let actions$: Observable<Action>;
  let effects: ErrorEffects;
  const environmentService = jasmine.createSpyObj<EnvironmentService>('environmentService', [
    'isDev'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$)]
    });

    effects = new ErrorEffects(actions$, environmentService);
  });

  describe('Error Occured effect', () => {
    // given
    environmentService.isDev.and.returnValue(true);

    const action = new ErrorOccuredAction({ error: { message: 'this is message' } });
    actions$ = hot('-a', { a: action });

    // when & then
    expect(effects.errorOccured$).toBeObservable(noop);
    expect(environmentService.isDev).toHaveBeenCalledTimes(1);
  });
});
