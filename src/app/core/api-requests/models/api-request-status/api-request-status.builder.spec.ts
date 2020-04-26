import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';

describe('Api Request Status Builder', () => {
  [
    { name: 'loading', expected: { started: true, succeded: false, failed: false } },
    { name: 'success', expected: { started: false, succeded: true, failed: false } },
    { name: 'failure', expected: { started: false, succeded: false, failed: true, errorCode: 'test' } }
  ].forEach((input) => {
    it(`should create ${input.name} state`, () => {
      let actual = {};
      const id = 'apiRequestId';

      switch (input.name) {
        case 'loading':
          actual = ApiRequestStatusBuilder.start(id);
          break;
        case 'success':
          actual = ApiRequestStatusBuilder.success(id);
          break;
        case 'failure':
          actual = ApiRequestStatusBuilder.fail(id, input.expected.errorCode);
          break;
      }

      expect(actual).toEqual({ ...input.expected, id, errorCode: input.expected.errorCode || null });
    });
  });
});
