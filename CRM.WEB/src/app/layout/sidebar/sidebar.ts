import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'people', label: 'Prospects', route: '/prospects' },
    { icon: 'badge', label: 'Employees', route: '/employees' },
    { icon: 'inventory_2', label: 'Products', route: '/products' },
    { icon: 'report_problem', label: 'Réclamations', route: '/reclamations' },
    { icon: 'bar_chart', label: 'Reports', route: '/reports' },
    { icon: 'settings', label: 'Settings', route: '/settings' },
  ];
}
