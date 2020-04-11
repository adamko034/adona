import { createAction, props } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { errorActions } from 'src/app/core/store/actions/error.actions';
import { DefaultErrorMessageBuilder } from '../../error/builders/default-error-message.builder';
import { DefaultErrorType } from '../../error/enum/default-error-type.enum';
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
      const error = ErrorTestDataBuilder.from().withDefaultData().build();
      const failureAction = createAction('test action', props<{ error: Error }>());

      const actions$ = hot('--a', { a: failureAction({ error }) });
      const expected = cold('--b', { b: errorActions.broadcast({ error }) });

      const result = service.createFrom(actions$, failureAction, null);

      expect(result).toBeObservable(expected);
    });
  });

  [
    DefaultErrorType.ApiDelete,
    DefaultErrorType.ApiGet,
    DefaultErrorType.ApiOther,
    DefaultErrorType.ApiPost,
    DefaultErrorType.ApiPut
  ].forEach((type) => {
    it(`should create effect dispatching Error Broadcast action with default ${type.toString()} message`, () => {
      const error = ErrorTestDataBuilder.from().withDefaultData().withMessage(null).build();
      const expectedError = ErrorTestDataBuilder.from()
        .withDefaultData()
        .withMessage(DefaultErrorMessageBuilder.from(type).build())
        .build();
      const failureAction = createAction('test action', props<{ error: Error }>());

      const actions$ = hot('--a', { a: failureAction({ error }) });
      const expected = cold('--b', { b: errorActions.broadcast({ error: expectedError }) });

      const result = service.createFrom(actions$, failureAction, type);

      expect(result).toBeObservable(expected);
    });
  });
});
