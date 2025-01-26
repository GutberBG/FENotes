import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from '../features/auth/login/login.component';
import { RegisterComponent } from '../features/auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AuthRoutingModule],
})
export class AuthModule {}
