import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isLoading = false;
  errorMessage: string = '';

  // Formulario reactivo para crear un usuario
  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  // Método para enviar el formulario y registrar al usuario
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { username, email, password } = this.registerForm.value;

    // Llamar al servicio de autenticación para registrar el usuario
    this.authService.register({ username, email, password }).subscribe(
      (response) => {
        // Manejar la respuesta exitosa, redirigir al login
        this.router.navigate(['/auth/login']);
        this.isLoading = false;
      },
      (error) => {
        // Manejar error en el registro
        this.errorMessage = 'Error al registrar el usuario. Intente nuevamente.';
        this.isLoading = false;
        console.error(error);
      }
    );
  }
}
