import { Error } from './error.model';

export class ErrorBuilder {
  private error: Error;

  private constructor() {
    this.error = {};
  }

  public static from(): ErrorBuilder {
    return new ErrorBuilder();
  }

  public withFirebaseError(id: string, errorCode: string): ErrorBuilder {
    this.error.id = id;
    this.error.code = errorCode;

    return this;
  }

  public withErrorObject(errorObject: any): ErrorBuilder {
    this.error.errorObj = errorObject;
    return this;
  }

  public withErrorMessage(errorMessage: string): ErrorBuilder {
    this.error.message = errorMessage;
    return this;
  }

  public build(): Error {
    return this.error;
  }
}
