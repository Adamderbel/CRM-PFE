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
  constructor(private authService: AuthService) { }

  private allMenuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard', roles: ['Commercial'] },
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard-client', roles: ['Client_User'] },
    { icon: 'receipt', label: 'Consulter mes commandes', route: '/commande-client', roles: ['Client_User'] },
    { icon: 'report_problem', label: 'Mes Réclamations', route: '/mes-reclamations', roles: ['Client_User'] },
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard-admin', roles: ['Admin'] },
    { icon: 'people', label: 'Prospects', route: '/prospects', roles: ['Commercial'] },
    { icon: 'group', label: 'Clients', route: '/clients', roles: ['Commercial'] },
    { icon: 'badge', label: 'Commerciaux', route: '/employees', roles: ['Admin'] },
    { icon: 'report_problem', label: 'Réclamations', route: '/reclamations', roles: ['Commercial'] },
    { icon: 'bar_chart', label: 'Reports', route: '/reports', roles: ['Admin', 'Commercial'] },
    { icon: 'settings', label: 'Settings', route: '/settings', roles: ['Admin'] },
  ];

  menuItems = computed(() => {
    return this.allMenuItems.filter(item => {
      if (!item.roles) return true;
      return item.roles.some(role => this.authService.hasRole(role));
    });
  });
}

