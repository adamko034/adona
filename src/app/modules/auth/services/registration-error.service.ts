import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RegistrationErrorBuilder } from 'src/app/modules/auth/models/registration/registration-error.builder';
import { RegistrationError } from 'src/app/modules/auth/models/registration/registration-error.model';
import { registrationErrorCodes, registrationErrorMessages } from '../constants/registration-error-messages.constants';

@Injectable({ providedIn: 'root' })
export class RegistrationErrorService {
  private errors$: Subject<RegistrationError>;

  public push(errorCode: string) {
    if (!this.errors$) {
      this.errors$ = new Subject<RegistrationError>();
    }

    if (!errorCode) {
      this.errors$.next(null);
      return;
    }

    const message = this.getMessage(errorCode);
    this.errors$.next(RegistrationErrorBuilder.from(errorCode, message).build());
  }

  public selectErrors(): Observable<RegistrationError> {
    if (!this.errors$) {
      this.errors$ = new Subject<RegistrationError>();
    }

    return this.errors$.asObservable();
  }

  private getMessage(code: string): string {
    if (code) {
      const message = registrationErrorMessages[code.toLowerCase()];

      return message || registrationErrorMessages[registrationErrorCodes.unknown];
    }

    return null;
  }
}
