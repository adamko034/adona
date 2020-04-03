import { BackendStateBuilder } from 'src/app/core/gui/model/backend-state/backend-state.builder';

describe('BackendStateBuilder', () => {
  [
    { name: 'loading', expected: { loading: true, success: false, failure: false } },
    { name: 'success', expected: { loading: false, success: true, failure: false } },
    { name: 'failure', expected: { loading: false, success: false, failure: true } }
  ].forEach(input => {
    it(`should create ${input.name} state`, () => {
      let actual = {};

      switch (input.name) {
        case 'loading':
          actual = BackendStateBuilder.loading();
          break;
        case 'success':
          actual = BackendStateBuilder.success();
          break;
        case 'failure':
          actual = BackendStateBuilder.failure();
          break;
      }

      expect(actual).toEqual(input.expected);
    });
  });
});
