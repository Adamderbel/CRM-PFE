import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientCermService } from '../../../core/services/client-cerm.service';
import { ClientCerm } from '../../../core/models/client-cerm.model';

interface ClientUI extends ClientCerm {
  email: string;
  contactPerson: string;
  status: 'Actif' | 'En attente' | 'Suspendu';
  avatar?: string;
  revenue?: string;
}

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.css'
})
export class ClientsList implements OnInit {
  isModalOpen = false;
  isLoading = signal(false);
  searchQuery = signal('');

  // Extended mock data for UI demo
  clients = signal<ClientUI[]>([
    { refClient: 1024, nom: 'Global Tech Solutions', contactPerson: 'Alice Dubois', email: 'contact@globaltech.fr', status: 'Actif', lastSyncDate: '2024-05-10', avatar: 'GT', revenue: '1.2M €' },
    { refClient: 1085, nom: 'Industries Martin SAS', contactPerson: 'Robert Martin', email: 'r.martin@indusmartin.com', status: 'Actif', lastSyncDate: '2024-05-12', avatar: 'IM', revenue: '450K €' },
    { refClient: 2142, nom: 'BioHealth Pharma', contactPerson: 'Clara Bernard', email: 'c.bernard@biohealth.org', status: 'En attente', lastSyncDate: '2024-05-08', avatar: 'BH', revenue: '890K €' },
    { refClient: 3051, nom: 'Luxe & Co', contactPerson: 'Marc Leroy', email: 'm.leroy@luxeco.com', status: 'Suspendu', lastSyncDate: '2024-04-30', avatar: 'LC', revenue: '2.5M €' },
    { refClient: 4122, nom: 'Green Energy Group', contactPerson: 'Sophie Guerin', email: 's.guerin@greenenergy.eu', status: 'Actif', lastSyncDate: '2024-05-14', avatar: 'GE', revenue: '1.8M €' },
  ]);

  newClient = {
    nom: '',
    contactPerson: '',
    email: '',
    status: 'Actif' as const
  };

  filteredClients = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.clients().filter(c => 
      (c.nom?.toLowerCase().includes(query)) || 
      (c.refClient.toString().includes(query)) ||
      (c.contactPerson.toLowerCase().includes(query))
    );
  });

  stats = computed(() => {
    const list = this.clients();
    return {
      total: list.length,
      active: list.filter(c => c.status === 'Actif').length,
      pending: list.filter(c => c.status === 'En attente').length,
      revenue: '6.84M €'
    };
  });

  constructor(private clientService: ClientCermService) {
    console.log('ClientsList component loaded');
  }

  ngOnInit(): void {
    // We keep the mock data for UI demo, but we could fetch from service here
    // this.loadFromService();
  }

  loadFromService(): void {
    this.isLoading.set(true);
    this.clientService.recherche({}).subscribe({
      next: (data) => {
        // Map ClientCerm to ClientUI with defaults
        const mapped: ClientUI[] = data.map(c => ({
          ...c,
          email: 'info@' + (c.nom?.toLowerCase().replace(/\s/g, '') || 'client') + '.com',
          contactPerson: 'À définir',
          status: 'Actif',
          avatar: c.nom?.substring(0, 2).toUpperCase() || 'CL',
          revenue: '---'
        }));
        this.clients.set(mapped);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  createClient() {
    const clientToAdd: ClientUI = {
      refClient: Math.floor(Math.random() * 9000) + 1000,
      nom: this.newClient.nom,
      contactPerson: this.newClient.contactPerson,
      email: this.newClient.email,
      status: this.newClient.status,
      lastSyncDate: new Date().toISOString().split('T')[0],
      avatar: this.newClient.nom.substring(0, 2).toUpperCase(),
      revenue: '0 €'
    };

    this.clients.update(list => [clientToAdd, ...list]);
    this.closeModal();
    this.newClient = { nom: '', contactPerson: '', email: '', status: 'Actif' };
  }

  onSearchChange(value: string) {
    this.searchQuery.set(value);
  }
}
