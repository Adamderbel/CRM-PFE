import { Component, computed } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private authService: AuthService) {}

  userName = computed(() => this.authService.userFullName() || 'Utilisateur');

  logout() {
    this.authService.logout();
  }
}
