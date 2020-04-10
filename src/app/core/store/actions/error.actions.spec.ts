import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
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
      // given
      const errObj = { error: 'internal server error', code: 500 };
      const message = 'this is error message';

      // when
      const action = errorActions.handleError({ error: { errorObj: errObj, message } });

      // then
      expect({ ...action }).toEqual({
        type: errorActionsTypes.handle,
        error: { errorObj: errObj, message }
      });
    });

    it('should create action with empty message', () => {
      // given
      const errObj = { error: 'internal server error', code: 500 };

      // when
      const action = errorActions.handleError({ error: { errorObj: errObj } });

      // then
      expect({ ...action }).toEqual({
        type: errorActionsTypes.handle,
        error: { errorObj: errObj }
      });
    });

    it('should create action with empty error object', () => {
      // given
      const message = 'this is error message';

      // when
      const action = errorActions.handleError({ error: { message } });

      // then
      expect({ ...action }).toEqual({
        type: errorActionsTypes.handle,
        error: { message }
      });
    });

    it('should create action with empty payload', () => {
      // when
      const action = errorActions.handleError({ error: null });

      // then
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
