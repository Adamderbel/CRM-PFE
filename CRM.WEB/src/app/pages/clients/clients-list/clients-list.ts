import { Component, OnInit, signal, computed, Injector, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientCermService } from '../../../core/services/client-cerm.service';
import { AuthService } from '../../../core/services/auth.service';
import { ClientCerm } from '../../../core/models/client-cerm.model';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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
  isSaving = signal(false);
  searchQuery = signal('');

  // Search logic for ClientCerm linking
  clientSearchQuery = signal('');
  foundClients = signal<ClientCerm[]>([]);
  selectedClient = signal<ClientCerm | null>(null);
  isSearchingClient = signal(false);

  // Extended mock data for UI demo
  clients = signal<ClientUI[]>([]);

  newClient = {
    nom: '',
    prenom: '',
    username: '',
    password: '',
    email: '',
    refClient: null as number | null
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

  constructor(
    private clientService: ClientCermService,
    private authService: AuthService,
    private injector: Injector
  ) {
    console.log('ClientsList component loaded');
    this.setupClientSearch();
  }

  private setupClientSearch() {
    toObservable(this.clientSearchQuery, { injector: this.injector }).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isSearchingClient.set(true)),
      switchMap(query => {
        if (!query || query.length < 2) {
          this.foundClients.set([]);
          this.isSearchingClient.set(false);
          return of([]);
        }

        const isNumeric = /^\d+$/.test(query);
        const searchParams = isNumeric
          ? { refClient: query, limit: 10 }
          : { nom: query, limit: 10 };

        return this.clientService.recherche(searchParams).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe(clients => {
      this.foundClients.set(clients);
      this.isSearchingClient.set(false);
    });
  }

  selectClient(client: ClientCerm) {
    this.selectedClient.set(client);
    this.clientSearchQuery.set(client.nom || client.refClient.toString());
    this.newClient.refClient = client.refClient;
    // On ne force plus le remplacement du nom pour permettre à l'utilisateur de taper ce qu'il veut
    // if (client.nom) {
    //   this.newClient.nom = client.nom;
    // }
    this.foundClients.set([]);
  }

  clearClient() {
    this.selectedClient.set(null);
    this.clientSearchQuery.set('');
    this.newClient.refClient = null;
  }


  ngOnInit(): void {
    this.loadFromService();
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
    this.isSaving.set(true);
    const registerReq = {
      nom: this.newClient.nom,
      prenom: this.newClient.prenom,
      userName: this.newClient.username,
      password: this.newClient.password,
      email: this.newClient.email || `${this.newClient.username}@client.com`,
      role: 'Client_User',
      refClient: this.newClient.refClient
    };

    this.authService.register(registerReq).subscribe({
      next: () => {
        this.isSaving.set(false);
        alert('Compte client créé avec succès ! Vous pouvez maintenant vous connecter avec ces identifiants.');
        this.loadFromService();
        this.closeModal();
        this.newClient = { nom: '', prenom: '', username: '', password: '', email: '', refClient: null };
        this.clearClient();
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error('Erreur lors de la création du compte', err);
        alert('Erreur lors de la création du compte. Vérifiez les informations.');
      }
    });
  }

  onSearchChange(value: string) {
    this.searchQuery.set(value);
  }
}
