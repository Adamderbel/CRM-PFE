import { Component, signal } from '@angular/core';

interface Prospect {
  name: string;
  company: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Nurturing' | 'Lost';
  lastContact: string;
}

interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

interface Product {
  name: string;
  category: 'Software' | 'Services' | 'Hardware';
  price: number;
  image: string;
}

interface ActionItem {
  icon: string;
  text: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  userName = signal('Olivia Davis');
  searchQuery = signal('');

  metrics = [
    { label: 'Total Prospects', value: '1,250', icon: 'people', change: '12.5% since last month', trend: 'up' },
    { label: 'Active Employees', value: '48', icon: 'business_center', change: '5% since last quarter', trend: 'up' },
    { label: 'Products in Catalog', value: '189', icon: 'inventory_2', change: '8.2% new this year', trend: 'up' },
    { label: 'Recent Conversions', value: '35', icon: 'check_circle', change: '20% compared to last week', trend: 'up' },
  ];

  prospects: Prospect[] = [
    { name: 'John Smith', company: 'Innovate Corp', status: 'New', lastContact: '2024-07-20' },
    { name: 'Sarah Lee', company: 'Global Solutions', status: 'Contacted', lastContact: '2024-07-18' },
    { name: 'Michael Chen', company: 'Tech Innovations', status: 'Qualified', lastContact: '2024-07-15' },
    { name: 'Emily White', company: 'Creative Labs', status: 'Nurturing', lastContact: '2024-07-10' },
    { name: 'David Brown', company: 'Future Systems', status: 'Lost', lastContact: '2024-07-05' },
  ];

  teamMembers: TeamMember[] = [
    { name: 'Jane Doe', role: 'Sales Manager', initials: 'JD' },
    { name: 'Mark Johnson', role: 'Product Lead', initials: 'MJ' },
    { name: 'Anna Williams', role: 'Marketing Specialist', initials: 'AW' },
    { name: 'Robert Davis', role: 'Customer Success', initials: 'RD' },
  ];

  products: Product[] = [
    { name: 'CRM Pro Suite', category: 'Software', price: 299.99, image: '' },
    { name: 'Smart Analytics Module', category: 'Software', price: 149.99, image: '' },
    { name: 'CRM Onboarding Service', category: 'Services', price: 499.00, image: '' },
    { name: 'Wireless Headset Pro', category: 'Hardware', price: 99.50, image: '' },
  ];

  actions: ActionItem[] = [
    { icon: 'person_add', text: 'John Smith was added as a New Prospect by Olivia Davis.', time: '5 minutes ago' },
    { icon: 'sync', text: 'Prospect Sarah Lee\'s status was updated to Contacted.', time: '1 hour ago' },
    { icon: 'add_box', text: 'New product CRM Pro Suite was added to the catalog.', time: '2 hours ago' },
    { icon: 'trending_up', text: 'A new conversion for Tech Innovations was recorded.', time: '4 hours ago' },
    { icon: 'edit_note', text: 'Mark Johnson updated product documentation.', time: 'Yesterday' },
  ];

  getStatusClass(status: string): string {
    return 'status-badge status-' + status.toLowerCase();
  }

  getCategoryClass(category: string): string {
    return 'category-badge category-' + category.toLowerCase();
  }

  getProductColor(category: string): string {
    switch (category) {
      case 'Software': return '#7c5cfc';
      case 'Services': return '#2196f3';
      case 'Hardware': return '#ff5722';
      default: return '#999';
    }
  }
}
