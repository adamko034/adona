import { ApiRequestStateBuilder } from 'src/app/core/gui/model/backend-state/api-request-state.builder';

describe('Api Request State Builder', () => {
  [
    { name: 'loading', expected: { started: true, succeded: false, failed: false } },
    { name: 'success', expected: { started: false, succeded: true, failed: false } },
    { name: 'failure', expected: { started: false, succeded: false, failed: true } },
    { name: 'failureWithErrorCode', expected: { started: false, succeded: false, failed: true, errorCode: 'test' } }
  ].forEach((input) => {
    it(`should create ${input.name} state`, () => {
      let actual = {};

      switch (input.name) {
        case 'loading':
          actual = ApiRequestStateBuilder.start();
          break;
        case 'success':
          actual = ApiRequestStateBuilder.success();
          break;
        case 'failure':
          actual = ApiRequestStateBuilder.fail();
          break;
        case 'failureWithErrorCode':
          actual = ApiRequestStateBuilder.fail(input.expected.errorCode);
          break;
      }

      expect(actual).toEqual(input.expected);
    });
  });
});
