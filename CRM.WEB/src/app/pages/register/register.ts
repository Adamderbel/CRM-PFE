import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  userName = signal('');
  nom = signal('');
  prenom = signal('');
  email = signal('');
  password = signal('');
  selectedRole = signal<'ADMIN' | 'COMMERCIAL'>('ADMIN');
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  selectRole(role: 'ADMIN' | 'COMMERCIAL') {
    this.selectedRole.set(role);
  }

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  getPasswordStrength(): number {
    const p = this.password();
    if (!p) return 0;
    let strength = 0;
    if (p.length >= 6) strength++;
    if (/[A-Z]/.test(p)) strength++;
    if (/[0-9]/.test(p)) strength++;
    if (/[^A-Za-z0-9]/.test(p)) strength++;
    return strength;
  }

  onSubmit() {
    if (!this.userName() || !this.nom() || !this.prenom() || !this.email() || !this.password()) {
      this.errorMessage.set('Veuillez remplir tous les champs.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService
      .register({
        userName: this.userName(),
        nom: this.nom(),
        prenom: this.prenom(),
        email: this.email(),
        password: this.password(),
        role: this.selectedRole(),
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.successMessage.set('Compte créé avec succès ! Redirection...');
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.status === 400) {
            const msg =
              err.error?.errors
                ? Object.values(err.error.errors).flat().join(' ')
                : err.error || 'Données invalides.';
            this.errorMessage.set(typeof msg === 'string' ? msg : 'Données invalides.');
          } else if (err.status === 0) {
            this.errorMessage.set('Impossible de contacter le serveur.');
          } else {
            this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
          }
        },
      });
  }
}
