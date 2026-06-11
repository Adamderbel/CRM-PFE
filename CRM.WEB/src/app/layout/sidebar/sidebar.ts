import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

  private allMenuItems: MenuItem[] = [
    {
      icon: 'dashboard',
      label: 'Tableau de bord',
      route: '/dashboard',
      roles: ['ADMIN', 'COMMERCIAL', 'MANAGER'],
    },
    { icon: 'people', label: 'Prospects', route: '/prospects', roles: ['ADMIN', 'COMMERCIAL', 'MANAGER'] },
    { icon: 'business', label: 'Liste des Clients', route: '/clients', roles: ['ADMIN', 'COMMERCIAL', 'MANAGER'] },
    { icon: 'report_problem', label: 'Réclamations', route: '/reclamations', roles: ['ADMIN', 'COMMERCIAL', 'MANAGER'] },
    {
      icon: 'history',
      label: 'Historique commercial',
      route: '/historique-commercial',
      roles: ['MANAGER', 'ADMIN'],
    },
    {
      icon: 'insert_chart_outlined',
      label: 'Power BI',
      route: '/power-bi',
      roles: ['MANAGER', 'ADMIN'],
    },
    { icon: 'article', label: 'Utilisateurs & droits', route: '/utilisateur', roles: ['ADMIN'] },
  ];

  menuItems = computed(() => {
    return this.allMenuItems.filter(item => {
      if (!item.roles) return true;
      return item.roles.some(role => this.authService.hasRole(role));
    });
  });
}
