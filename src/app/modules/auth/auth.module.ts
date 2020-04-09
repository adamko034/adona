import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NewPasswordComponent } from 'src/app/modules/auth/components/new-password/new-password.component';
import { ChangePasswordComponent } from 'src/app/modules/auth/pages/change-password/change-password.component';
import { LoginComponent } from 'src/app/modules/auth/pages/login/login.component';
import { RegisterComponent } from 'src/app/modules/auth/pages/register/register.component';
import { ResetPasswordComponent } from 'src/app/modules/auth/pages/reset-password/reset-password.component';
import { VerifyEmailComponent } from 'src/app/modules/auth/pages/verify-email/verify-email.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyEmailComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    NewPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    MatPasswordStrengthModule,
    MatIconModule,
    MatSlideToggleModule
  ]
})
export class AuthModule {}
