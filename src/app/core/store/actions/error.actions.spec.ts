import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { errorActions, errorActionsTypes } from 'src/app/core/store/actions/error.actions';

describe('Error Actions', () => {
  describe('Handle Error', () => {
    it('should create action', () => {
      expect(errorActions.handleError({ error: ErrorBuilder.from().withErrorObject({ code: 500 }).build() })).toEqual({
        type: errorActionsTypes.handle,
        error: ErrorBuilder.from().withErrorObject({ code: 500 }).build()
      });
    });
  });

  describe('Broadcast Error', () => {
    it('should create action with full payload', () => {
      const errObj = { error: 'internal server error', code: 500 };
      const message = 'this is error message';
      const toastr = ToastrDataBuilder.from('test message', ToastrMode.INFO).build();

      const action = errorActions.handleError({ error: { errorObj: errObj, message }, toastr });

      expect({ ...action }).toEqual({
        type: errorActionsTypes.handle,
        error: { errorObj: errObj, message },
        toastr
      });
    });

    it('should create action with empty message', () => {
      const errObj = { error: 'internal server error', code: 500 };

      const action = errorActions.handleError({ error: { errorObj: errObj } });

      expect({ ...action }).toEqual({
        type: errorActionsTypes.handle,
        error: { errorObj: errObj }
      });
    });

    it('should create action with empty error object', () => {
      const message = 'this is error message';

      const action = errorActions.handleError({ error: { message } });

      expect({ ...action }).toEqual({
        type: errorActionsTypes.handle,
        error: { message }
      });
    });

    it('should create action with empty payload', () => {
      const action = errorActions.handleError({ error: null });

      expect({ ...action }).toEqual({
        type: errorActionsTypes.handle,
        error: null
      });
    });
  });

  describe('Clear Error', () => {
    it('should create action', () => {
      expect({ ...errorActions.clearError() }).toEqual({ type: errorActionsTypes.clear });
    });
  });
});
