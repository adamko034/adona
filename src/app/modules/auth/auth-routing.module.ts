import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthActionsComponent } from 'src/app/modules/auth/components/auth-actions/auth-actions.component';
import { ChangePasswordComponent } from 'src/app/modules/auth/pages/change-password/change-password.component';
import { EmailVerifiedComponent } from 'src/app/modules/auth/pages/email-verified/email-verified.component';
import { LoginComponent } from 'src/app/modules/auth/pages/login/login.component';
import { RegisterComponent } from 'src/app/modules/auth/pages/register/register.component';
import { ResetPasswordComponent } from 'src/app/modules/auth/pages/reset-password/reset-password.component';
import { VerifyEmailComponent } from 'src/app/modules/auth/pages/verify-email/verify-email.component';
import { UserEmailVerifiedGuard } from './guards/user-email-verified.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'verifyEmail',
    component: VerifyEmailComponent,
    canActivate: [UserEmailVerifiedGuard]
  },
  {
    path: 'emailVerified',
    component: EmailVerifiedComponent
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent
  },
  {
    path: 'changePassword',
    component: ChangePasswordComponent
  },
  {
    path: 'actions',
    component: AuthActionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
