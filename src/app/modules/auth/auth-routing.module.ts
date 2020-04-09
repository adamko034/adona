import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from 'src/app/modules/auth/pages/change-password/change-password.component';
import { LoginComponent } from 'src/app/modules/auth/pages/login/login.component';
import { RegisterComponent } from 'src/app/modules/auth/pages/register/register.component';
import { ResetPasswordComponent } from 'src/app/modules/auth/pages/reset-password/reset-password.component';
import { VerifyEmailComponent } from 'src/app/modules/auth/pages/verify-email/verify-email.component';
import { UserEmailVerifiedGuard } from './guards/user-email-verified.guard';

const routes: Routes = [
  {
    path: '',
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
    path: 'resetPassword',
    component: ResetPasswordComponent
  },
  {
    path: 'changePassword',
    component: ChangePasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
