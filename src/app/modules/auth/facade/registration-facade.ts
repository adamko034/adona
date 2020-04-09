import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, mapTo, mergeMap, switchMap } from 'rxjs/operators';
import { Credentials } from 'src/app/core/auth/model/credentials.model';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { BackendState } from 'src/app/core/gui/model/backend-state/backend-state.model';
import { UserBuilder } from 'src/app/core/user/model/builders/user.builder';
import { UserService } from 'src/app/core/user/services/user.service';
import { registrationErrorCodes } from 'src/app/modules/auth/constants/registration-error-messages.constants';
import { RegistrationError } from 'src/app/modules/auth/models/registration/registration-error.model';
import { EmailConfirmationService } from 'src/app/modules/auth/services/email-confirmation.service';
import { RegistrationErrorService } from 'src/app/modules/auth/services/registration-error.service';
import { ResetPasswordService } from 'src/app/modules/auth/services/reset-password/reset-password.service';

@Injectable({ providedIn: 'root' })
export class RegistrationFacade {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private registrationErrorService: RegistrationErrorService,
    private emailConfirmationService: EmailConfirmationService,
    private resetPasswordService: ResetPasswordService
  ) {}

  public register(credentials: Credentials): Observable<boolean> {
    return this.authService.register(credentials).pipe(
      switchMap((firebaseUser: firebase.User) => {
        const user = UserBuilder.from(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName)
          .withDefaultPhotoUrl()
          .build();

        return this.userService.createUser(user).pipe(mapTo(firebaseUser));
      }),
      mergeMap((firebaseUser: firebase.User) => {
        return this.emailConfirmationService.send(firebaseUser);
      }),
      map(() => true),
      catchError((err) => {
        const errorCode = err.code || registrationErrorCodes.unknown;
        this.registrationErrorService.push(errorCode);
        return of(false);
      })
    );
  }

  public resendEmailConfirmationLink() {
    return this.emailConfirmationService.sendUsingAuthorizedUser();
  }

  public sendPasswordResetEmail(email: string): Observable<BackendState> {
    return this.resetPasswordService.sendPasswordResetEmail(email);
  }

  public confirmPasswordReset(oobCode: string, newPassword: string): Observable<BackendState> {
    return this.resetPasswordService.confirmPasswordReset(oobCode, newPassword);
  }

  public selectRegistrationError(): Observable<RegistrationError> {
    return this.registrationErrorService.selectErrors().pipe(distinctUntilChanged());
  }

  public pushFormInvalidError() {
    this.registrationErrorService.push(registrationErrorCodes.formInvalid);
  }

  public pushPasswordsDoNotMatchError() {
    this.registrationErrorService.push(registrationErrorCodes.passwordsDoNotMatch);
  }

  public clearRegistrationErrors() {
    this.registrationErrorService.push(null);
  }
}
