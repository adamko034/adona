import { errors } from '../constants/errors.constants';
import { DefaultErrorType } from '../enum/default-error-type.enum';

export class DefaultErrorMessageBuilder {
  private constructor(private type: DefaultErrorType) {}

  public static from(type: DefaultErrorType): DefaultErrorMessageBuilder {
    return new DefaultErrorMessageBuilder(type);
  }

  public build(): string {
    switch (this.type) {
      case DefaultErrorType.ApiGet:
        return errors.DEFAULT_API_GET_ERROR_MESSAGE;
      case DefaultErrorType.ApiPut:
        return errors.DEFAULT_API_PUT_ERROR_MESSAGE;
      case DefaultErrorType.ApiDelete:
        return errors.DEFAULT_API_DELETE_ERROR_MESSAGE;
      case DefaultErrorType.ApiPost:
        return errors.DEFAULT_API_POST_ERROR_MESSAGE;
      case DefaultErrorType.ApiOther:
        return errors.DEFAULT_API_OTHER_ERROR_MESSAGE;
    }
  }
}
