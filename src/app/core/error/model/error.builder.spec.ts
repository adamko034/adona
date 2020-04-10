import { ErrorBuilder } from 'src/app/core/error/model/error.builder';

describe('Error Builder', () => {
  it('should create Error only with error object', () => {
    expect(ErrorBuilder.from().withErrorObject({ code: 500 }).build()).toEqual({ errorObj: { code: 500 } });
  });

  it('should create full Error object', () => {
    expect(
      ErrorBuilder.from()
        .withErrorMessage('test message')
        .withErrorObject({ code: 500 })
        .withFirebaseError('1', '500')
        .build()
    ).toEqual({
      code: '500',
      id: '1',
      message: 'test message',
      errorObj: { code: 500 }
    });
  });
});
