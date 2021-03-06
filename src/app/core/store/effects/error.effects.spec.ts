import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs';
import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { apiRequestActions } from 'src/app/core/store/actions/api-requests.actions';
import { ErrorEffects } from 'src/app/core/store/effects/error.effects';
import { resources } from 'src/app/shared/resources/resources';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';
import { errorActions } from '../actions/error.actions';

describe('Error Effects', () => {
  let actions$: Actions;
  let effects: ErrorEffects;

  const {
    environmentService,
    apiRequestsFacade,
    firebaseErrorsService,
    guiFacade
  } = SpiesBuilder.init()
    .withApiRequestsFacade()
    .withFirebaseErrorsService()
    .withEnvironmentService()
    .withGuiFacade()
    .build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$)]
    });
    actions$ = TestBed.inject(Actions);

    effects = new ErrorEffects(actions$, environmentService, firebaseErrorsService, apiRequestsFacade, guiFacade);

    apiRequestsFacade.selectApiRequest.calls.reset();
    environmentService.isDev.calls.reset();
    firebaseErrorsService.isErrorHandled.calls.reset();
    guiFacade.hideLoading.calls.reset();
  });

  describe('Broadcast', () => {
    it('should show toastr and if dev env log error to console', () => {
      environmentService.isDev.and.returnValue(true);
      const action = errorActions.broadcastError({ error: { code: 'auth', message: 'test' } });
      actions$ = hot('-a-a', { a: action });
      const toastr = ToastrDataBuilder.from('test', ToastrMode.ERROR).withTitle(resources.toastr.title.error).build();

      expect(effects.broadcast$).toBeObservable(cold('-a-a', { a: action }));
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(guiFacade.showToastr, 2, toastr);
      expect(environmentService.isDev).toHaveBeenCalledTimes(2);
    });
  });

  describe('Handle', () => {
    it('should map to Api Request Fail action', () => {
      const apiRequestId = '1';

      apiRequestsFacade.selectApiRequest.and.returnValue(of(ApiRequestStatusBuilder.start(apiRequestId)));
      firebaseErrorsService.isErrorHandled.and.returnValue(true);

      actions$ = cold('--a', { a: errorActions.handleError({ error: { id: apiRequestId, code: 'testCode' } }) });

      expect(effects.handle$).toBeObservable(
        cold('--a', { a: apiRequestActions.requestFail({ id: apiRequestId, errorCode: 'testCode' }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.selectApiRequest, 1, apiRequestId);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(firebaseErrorsService.isErrorHandled, 1, 'testCode');
      expect(guiFacade.hideLoading).toHaveBeenCalledTimes(1);
    });

    it('should map to Broadcast action when api request not found', () => {
      apiRequestsFacade.selectApiRequest.and.returnValue(of(null));
      firebaseErrorsService.isErrorHandled.and.returnValue(false);
      const toastr = ToastrDataBuilder.from('test message', ToastrMode.INFO).build();

      actions$ = cold('--a', { a: errorActions.handleError({ error: { errorObj: { code: 500 } }, toastr }) });

      expect(effects.handle$).toBeObservable(
        cold('--a', { a: errorActions.broadcastError({ error: { errorObj: { code: 500 } }, toastr }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.selectApiRequest, 1, undefined);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(firebaseErrorsService.isErrorHandled, 1, undefined);
      expect(guiFacade.hideLoading).toHaveBeenCalledTimes(1);
    });

    it('should map to Broadcast and Api Reqeust Fail actions when firebase error is not handled', () => {
      const apiRequestId = '1';

      apiRequestsFacade.selectApiRequest.and.returnValue(of(ApiRequestStatusBuilder.start(apiRequestId)));
      firebaseErrorsService.isErrorHandled.and.returnValue(false);

      actions$ = cold('--a', {
        a: errorActions.handleError({ error: { errorObj: { code: 500 }, id: apiRequestId, code: 'testCode' } })
      });

      expect(effects.handle$).toBeObservable(
        cold('--(ab)', {
          a: errorActions.broadcastError({
            error: { errorObj: { code: 500 }, id: apiRequestId, code: 'testCode' },
            toastr: undefined
          }),
          b: apiRequestActions.requestFail({ id: apiRequestId, errorCode: null })
        })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.selectApiRequest, 1, apiRequestId);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(firebaseErrorsService.isErrorHandled, 1, 'testCode');
      expect(guiFacade.hideLoading).toHaveBeenCalledTimes(1);
    });
  });
});
