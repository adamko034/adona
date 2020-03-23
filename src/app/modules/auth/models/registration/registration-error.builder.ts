import { RegistrationError } from './registration-error.model';

export class RegistrationErrorBuilder {
  private model: RegistrationError;

  constructor(code: string, message: string) {
    this.model = { code, message };
  }

  public static from(code: string, message: string): RegistrationErrorBuilder {
    return new RegistrationErrorBuilder(code, message);
  }

  public build(): RegistrationError {
    return this.model;
  }
}
