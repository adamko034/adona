import { errors } from '../constants/errors.constants';
import { DefaultErrorType } from '../enum/default-error-type.enum';
import { DefaultErrorMessageBuilder } from './default-error-message.builder';

describe('Default Error Message Builder', () => {
  [
    {
      type: DefaultErrorType.ApiDelete,
      expected: errors.DEFAULT_API_DELETE_ERROR_MESSAGE
    },
    {
      type: DefaultErrorType.ApiGet,
      expected: errors.DEFAULT_API_GET_ERROR_MESSAGE
    },
    {
      type: DefaultErrorType.ApiPost,
      expected: errors.DEFAULT_API_POST_ERROR_MESSAGE
    },
    {
      type: DefaultErrorType.ApiPut,
      expected: errors.DEFAULT_API_PUT_ERROR_MESSAGE
    },
    {
      type: DefaultErrorType.ApiOther,
      expected: errors.DEFAULT_API_OTHER_ERROR_MESSAGE
    },
    {
      type: DefaultErrorType.ApiDelete,
      expected: errors.DEFAULT_API_DELETE_ERROR_MESSAGE
    }
  ].forEach(input => {
    it(`should return error message for type: ${input.type.toString()}`, () => {
      expect(DefaultErrorMessageBuilder.from(input.type).build()).toEqual(input.expected);
    });
  });
});
