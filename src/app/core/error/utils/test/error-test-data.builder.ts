import { resources } from 'src/app/shared/resources/resources';
import { Error } from '../../model/error.model';

export class ErrorTestDataBuilder {
  private error: Error;

  private constructor() {
    this.error = {};
  }

  public static from(): ErrorTestDataBuilder {
    return new ErrorTestDataBuilder();
  }

  public withMessage(message: string): ErrorTestDataBuilder {
    this.error.message = message;

    return this;
  }

  public withErrorObj(errorObj: any): ErrorTestDataBuilder {
    this.error.errorObj = errorObj;

    return this;
  }

  public withDefaultData(): ErrorTestDataBuilder {
    this.error.errorObj = { code: '500', title: 'Unhandled exception' };
    this.error.message = resources.general.errors.message;

    return this;
  }

  public build(): Error {
    return this.error;
  }
}
