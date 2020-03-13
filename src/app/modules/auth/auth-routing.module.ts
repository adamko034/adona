import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEmailVerifiedGuard } from 'src/app/core/user/guard/user-email-verified.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
