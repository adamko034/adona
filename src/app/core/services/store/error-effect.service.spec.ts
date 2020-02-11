import { createAction, props } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { DefaultErrorMessageBuilder } from '../../error/builders/default-error-message.builder';
import { DefaultErrorType } from '../../error/enum/default-error-type.enum';
import { Error } from '../../error/model/error.model';
import { ErrorOccuredAction } from '../../store/actions/error.actions';
import { ErrorTestDataBuilder } from '../../utils/tests/error-test-data.builder';
import { ErrorEffectService } from './error-effect.service';

fdescribe('Error Effect Service', () => {
  let service: ErrorEffectService;

  beforeEach(() => {
    service = new ErrorEffectService();
  });

  describe('Create From', () => {
    it('should create effect dispatching Error Occured Action with custom message', () => {
      const error = ErrorTestDataBuilder.from()
        .withDefaultData()
        .build();
      const failureAction = createAction('test action', props<{ error: Error }>());

      const actions$ = hot('--a', { a: failureAction({ error }) });
      const expected = cold('--b', { b: new ErrorOccuredAction({ error }) });

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
  ].forEach(type => {
    it(`should create effect dispatching Error Occured action with default ${type.toString()} message`, () => {
      const error = ErrorTestDataBuilder.from()
        .withDefaultData()
        .withMessage(null)
        .build();
      const expectedError = ErrorTestDataBuilder.from()
        .withDefaultData()
        .withMessage(DefaultErrorMessageBuilder.from(type).build())
        .build();
      const failureAction = createAction('test action', props<{ error: Error }>());

      const actions$ = hot('--a', { a: failureAction({ error }) });
      const expected = cold('--b', { b: new ErrorOccuredAction({ error: expectedError }) });

      const result = service.createFrom(actions$, failureAction, type);

      expect(result).toBeObservable(expected);
    });
  });
});
