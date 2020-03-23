import { Credentials } from '../credentials.model';

export class CredentialsBuilder {
  private credentials: Credentials;

  private constructor(email: string, password: string) {
    this.credentials = { email, password };
  }

  public static from(email: string, password: string): CredentialsBuilder {
    return new CredentialsBuilder(email, password);
  }

  public build(): Credentials {
    return this.credentials;
  }
}
