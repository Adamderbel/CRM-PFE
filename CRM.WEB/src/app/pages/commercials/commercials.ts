import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AuthUser, RegisterRequest } from '../../core/models/auth.model';

@Component({
  selector: 'app-commercials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commercials.html',
  styleUrl: './commercials.css'
})
export class Commercials implements OnInit {
  isModalOpen = false;
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Identical fields to Register page for consistency
  newAccount = {
    nom: '',
    prenom: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  commercials = signal<AuthUser[]>([]);

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadCommercials();
  }

  loadCommercials() {
    this.isLoading.set(true);
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.commercials.set(users.filter(u => 
          u.roles && u.roles.some(r => r.toUpperCase() === 'COMMERCIAL')
        ));
        this.isLoading.set(false);
        this.errorMessage.set('');
      },
      error: (err) => {
        this.isLoading.set(false);
        // If 405, we just ignore the listing error as discussed
        if (err.status !== 405) {
          console.error('List error:', err);
        }
      }
    });
  }

  openModal() {
    this.resetForm();
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  resetForm() {
    this.newAccount = {
      nom: '',
      prenom: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }

  createAccount() {
    // Validation
    if (!this.newAccount.nom || !this.newAccount.prenom || !this.newAccount.email || !this.newAccount.password) {
      this.errorMessage.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (this.newAccount.password !== this.newAccount.confirmPassword) {
      this.errorMessage.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    
    // Use the exact RegisterRequest format
    const request: RegisterRequest = {
      userName: this.newAccount.userName || (this.newAccount.prenom.toLowerCase() + this.newAccount.nom.toLowerCase()),
      nom: this.newAccount.nom,
      prenom: this.newAccount.prenom,
      email: this.newAccount.email,
      password: this.newAccount.password,
      role: 'COMMERCIAL' // Force uppercase as in Register page
    };

    this.authService.register(request).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Compte commercial créé avec succès ! Vous pouvez maintenant tester la connexion.');
        this.loadCommercials(); 
        setTimeout(() => this.closeModal(), 3000);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Register error details:', err);
        const msg = err.error?.message || err.error || 'Erreur lors de la création.';
        this.errorMessage.set(typeof msg === 'string' ? msg : 'Données invalides ou email déjà utilisé.');
      }
    });
  }
}
