import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import * as fromAuth from './store/reducers/auth.reducer';

@NgModule({
  declarations: [LoginComponent, AuthFormComponent, RegisterComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    StoreModule.forFeature('auth', fromAuth.authReducer)
  ]
})
export class AuthModule { }
