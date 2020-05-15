import { createAction, props } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { errorActions } from 'src/app/core/store/actions/error.actions';
import { Error } from '../../error/model/error.model';
import { ErrorTestDataBuilder } from '../../error/utils/test/error-test-data.builder';
import { ErrorEffectService } from './error-effect.service';

describe('Error Effect Service', () => {
  let service: ErrorEffectService;

  beforeEach(() => {
    service = new ErrorEffectService();
  });

  describe('Create From', () => {
    it('should create effect dispatching Error Broadcast action with custom message', () => {
      const error = ErrorTestDataBuilder.from().withDefaultData().withMessage('test').build();
      const failureAction = createAction('test action', props<{ error: Error }>());

      const actions$ = hot('--a', { a: failureAction({ error }) });
      const expected = cold('--b', { b: errorActions.handleError({ error }) });

      const result = service.createFrom(actions$, failureAction);

      expect(result).toBeObservable(expected);
    });
  });

  it('should create effect dispatching Error Broadcast action with default message', () => {
    const error = ErrorTestDataBuilder.from().withDefaultData().withMessage(null).build();
    const expectedError = ErrorTestDataBuilder.from().withDefaultData().build();
    const failureAction = createAction('test action', props<{ error: Error }>());

    const actions$ = hot('--a', { a: failureAction({ error }) });
    const expected = cold('--b', { b: errorActions.handleError({ error: expectedError }) });

    const result = service.createFrom(actions$, failureAction);

    expect(result).toBeObservable(expected);
  });
});
