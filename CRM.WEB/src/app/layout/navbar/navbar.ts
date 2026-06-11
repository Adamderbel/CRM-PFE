import { Component, computed, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  sidebarOpen = signal(false);

  constructor(private authService: AuthService) {}

  userName = computed(() => this.authService.userFullName() || 'Utilisateur');

  logout() {
    this.authService.logout();
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('mobile-open', this.sidebarOpen());
    }
  }
}
