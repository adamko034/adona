import { errorActions } from 'src/app/core/store/actions/error.actions';
import * as fromReducer from 'src/app/core/store/reducers/error/error.reducer';

describe('Error Reducer', () => {
  it('should return initial value if state is not set', () => {
    // given
    const action = {} as any;
    const expectedState: fromReducer.ErrorState = { error: null };

    // when
    const actual = fromReducer.reducer(undefined, action);

    // then
    expect(actual).toEqual(expectedState);
  });

  it('should return previous state for unknown action', () => {
    // given
    const action = {} as any;
    const previousState: fromReducer.ErrorState = {
      error: { message: 'this is error message' }
    };

    // when
    const actualState = fromReducer.reducer(previousState, action);

    // then
    expect(actualState).toEqual(previousState);
  });

  describe('On Error Broadcast', () => {
    it('should change error in state', () => {
      // given
      const action = errorActions.broadcastError({ error: { message: 'this is error' } });
      const previousState: fromReducer.ErrorState = {
        error: { message: 'this is previous error' }
      };

      // when
      const newState = fromReducer.reducer(previousState, action);

      // then
      expect(newState).toEqual({ ...newState, error: { message: action.error.message } });
    });
  });

  describe('On Error Clear', () => {
    it('should clear error', () => {
      const previousState: fromReducer.ErrorState = {
        error: { message: 'first error' }
      };

      const newState = fromReducer.reducer(previousState, errorActions.clearError());

      expect(newState).toEqual({ ...newState, error: null });
    });
  });
});
