import { Error } from '../../error/model/error.model';

export class ErrorTestDataBuilder {
  private error: Error;

  public constructor() {
    this.error = {};
  }

  public withDefaultData(): ErrorTestDataBuilder {
    this.error.errorObj = { code: '500', title: 'Unhandled exception' };
    this.error.message = 'This is test error message';

    return this;
  }

  public build(): Error {
    return this.error;
  }
}
