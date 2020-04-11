import { errorActions, errorActionsTypes } from 'src/app/core/store/actions/error.actions';

describe('Error Actions', () => {
  describe('Error Broadcast action', () => {
    it('should create action with full payload', () => {
      // given
      const errObj = { error: 'internal server error', code: 500 };
      const message = 'this is error message';

      // when
      const action = errorActions.broadcast({ error: { errorObj: errObj, message } });

      // then
      expect({ ...action }).toEqual({
        type: errorActionsTypes.broadcast,
        error: { errorObj: errObj, message }
      });
    });

    it('should create action with empty message', () => {
      // given
      const errObj = { error: 'internal server error', code: 500 };

      // when
      const action = errorActions.broadcast({ error: { errorObj: errObj } });

      // then
      expect({ ...action }).toEqual({
        type: errorActionsTypes.broadcast,
        error: { errorObj: errObj }
      });
    });

    it('should create action with empty error object', () => {
      // given
      const message = 'this is error message';

      // when
      const action = errorActions.broadcast({ error: { message } });

      // then
      expect({ ...action }).toEqual({
        type: errorActionsTypes.broadcast,
        error: { message }
      });
    });

    it('should create action with empty payload', () => {
      // when
      const action = errorActions.broadcast({ error: null });

      // then
      expect({ ...action }).toEqual({
        type: errorActionsTypes.broadcast,
        error: null
      });
    });
  });

  describe('Clear', () => {
    it('should create action', () => {
      expect({ ...errorActions.clear() }).toEqual({ type: errorActionsTypes.clear });
    });
  });
});
