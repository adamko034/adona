import { createAction, props } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrData } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.model';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
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
      const expected = cold('--b', { b: errorActions.handleError({ error, toastr: undefined }) });

      const result = service.createFrom(actions$, failureAction);

      expect(result).toBeObservable(expected);
    });
  });

  it('should create effect dispatching Error Broadcast action with default message', () => {
    const error = ErrorTestDataBuilder.from().withDefaultData().withMessage(null).build();
    const expectedError = ErrorTestDataBuilder.from().withDefaultData().build();
    const failureAction = createAction('test action', props<{ error: Error }>());

    const actions$ = hot('--a', { a: failureAction({ error }) });
    const expected = cold('--b', { b: errorActions.handleError({ error: expectedError, toastr: undefined }) });

    const result = service.createFrom(actions$, failureAction);

    expect(result).toBeObservable(expected);
  });

  it('should create effect dispatching Error Handle Error action with toastr', () => {
    const toastr = ToastrDataBuilder.from('test message', ToastrMode.INFO).build();
    const error = ErrorTestDataBuilder.from().withDefaultData().withMessage(null).build();
    const expectedError = ErrorTestDataBuilder.from().withDefaultData().build();
    const failureAction = createAction('test action', props<{ error: Error; toastr: ToastrData }>());

    const actions$ = hot('--a', { a: failureAction({ error, toastr }) });
    const expected = cold('--b', { b: errorActions.handleError({ error: expectedError, toastr }) });

    const result = service.createFrom(actions$, failureAction);

    expect(result).toBeObservable(expected);
  });
});
