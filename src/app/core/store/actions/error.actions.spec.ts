import { ErrorOccuredAction, ErrorActionTypes } from 'src/app/core/store/actions/error.actions';

describe('Error Actions', () => {
  describe('Error Occured action', () => {
    it('should create action with payload', () => {
      // given
      const message = 'this is error message';

      // when
      const action = new ErrorOccuredAction({ message });

      // then
      expect({ ...action }).toEqual({ type: ErrorActionTypes.ErrorOccured, payload: { message } });
    });
  });
});
