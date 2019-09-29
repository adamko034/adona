import { ErrorOccuredAction, ErrorActionTypes } from 'src/app/core/store/actions/error.actions';

describe('Error Actions', () => {
  describe('Error Occured action', () => {
    it('should create action with full payload', () => {
      // given
      const errObj = { error: 'internal server error', code: 500 };
      const message = 'this is error message';

      // when
      const action = new ErrorOccuredAction({ error: { errorObj: errObj, message } });

      // then
      expect({ ...action }).toEqual({
        type: ErrorActionTypes.ErrorOccured,
        payload: { error: { errorObj: errObj, message } }
      });
    });

    it('should create action with empty message', () => {
      // given
      const errObj = { error: 'internal server error', code: 500 };

      // when
      const action = new ErrorOccuredAction({ error: { errorObj: errObj } });

      // then
      expect({ ...action }).toEqual({
        type: ErrorActionTypes.ErrorOccured,
        payload: { error: { errorObj: errObj, message: null } }
      });
    });

    it('should create action with empty error object', () => {
      // given
      const message = 'this is error message';

      // when
      const action = new ErrorOccuredAction({ error: { message } });

      // then
      expect({ ...action }).toEqual({
        type: ErrorActionTypes.ErrorOccured,
        payload: { error: { errorObj: null, message } }
      });
    });

    it('should create action with empty payload', () => {
      // when
      const action = new ErrorOccuredAction({ error: null });

      // then
      expect({ ...action }).toEqual({
        type: ErrorActionTypes.ErrorOccured,
        payload: { error: null }
      });
    });
  });
});
