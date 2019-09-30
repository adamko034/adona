import { ErrorOccuredAction } from 'src/app/core/store/actions/error.actions';
import { errorReducer, ErrorState } from 'src/app/core/store/reducers/error/error.reducer';

describe('Error Reducer', () => {
  it('should return initial value if state is not set', () => {
    // given
    const action = {} as any;
    const expectedState: ErrorState = { error: null };

    // when
    const actual = errorReducer(undefined, action);

    // then
    expect(actual).toEqual(expectedState);
  });

  it('should return previous state for unknown action', () => {
    // given
    const action = {} as any;
    const previousState: ErrorState = {
      error: { message: 'this is error message' }
    };

    // when
    const actualState = errorReducer(previousState, action);

    // then
    expect(actualState).toEqual(previousState);
  });

  it('should return new state for Error Occured action', () => {
    // given
    const action = new ErrorOccuredAction({ error: { message: 'this is error' } });
    const previousState: ErrorState = {
      error: { message: 'this is previous error' }
    };

    // when
    const newState = errorReducer(previousState, action);

    // then
    expect(newState).toEqual({ error: { message: action.payload.error.message } });
  });
});
