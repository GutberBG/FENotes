import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;
  errorMessage: string = '';

  // Formulario reactivo
  loginForm = this.fb.group({
    username: ['', [Validators.required]],  // Cambiado de 'email' a 'username'
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  // Método para enviar el formulario
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const username = this.loginForm.get('username')?.value as string; // Cambiado de 'email' a 'username'
    const password = this.loginForm.get('password')?.value as string;

    // Llamar al servicio de autenticación para iniciar sesión
    this.authService.login({ username, password }).subscribe(
      (response) => {
        // Manejar la respuesta exitosa, redirigir al usuario
        this.router.navigate(['/auth/register']);
      },
      (error) => {
        // Manejar error
        this.errorMessage = 'Credenciales incorrectas o error en el servidor';
        this.isLoading = false;
        console.error(error);
      }
    );
  }
}
