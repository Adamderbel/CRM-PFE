import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = signal('');
  password = signal('');
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  onSubmit() {
    if (!this.email() || !this.password()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login({ email: this.email(), password: this.password() }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('Email ou mot de passe incorrect.');
        } else if (err.status === 0) {
          this.errorMessage.set('Impossible de contacter le serveur.');
        } else {
          this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
        }
      },
    });
  }
}

