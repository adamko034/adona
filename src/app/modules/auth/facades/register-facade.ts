import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Credentials } from 'src/app/core/auth/model/credentials.model';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';
import { registerActions } from 'src/app/modules/auth/store/actions/register.actions';
import { resetPasswordActions } from 'src/app/modules/auth/store/actions/reset-password.actions';
import { verifyEmailActions } from 'src/app/modules/auth/store/actions/verify-email.actions';

@Injectable({ providedIn: 'root' })
export class RegisterFacade {
  constructor(private store: Store<AuthState>) {}

  public register(credentials: Credentials, invitationId: string): void {
    this.store.dispatch(registerActions.registerRequested({ credentials, invitationId }));
  }

  public confirmEmailVerification(code: string): void {
    this.store.dispatch(verifyEmailActions.confirmEmailRequested({ code }));
  }

  public sendEmailVerificationLink(): void {
    this.store.dispatch(verifyEmailActions.sendEmailVerificationLinkRequested());
  }

  public sendPasswordResetEmail(email: string): void {
    this.store.dispatch(resetPasswordActions.sendPasswordResetLinkRequested({ email }));
  }

  public confirmPasswordReset(oobCode: string, newPassword: string): void {
    this.store.dispatch(resetPasswordActions.confirmPasswordResetRequested({ oobCode, newPassword }));
  }
}
