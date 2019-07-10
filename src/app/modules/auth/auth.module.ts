import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';

@NgModule({
  declarations: [LoginComponent, AuthFormComponent],
  imports: [CommonModule, AuthRoutingModule, AngularMaterialModule]
})
export class AuthModule {}
