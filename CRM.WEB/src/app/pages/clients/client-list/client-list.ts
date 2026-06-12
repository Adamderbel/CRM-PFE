import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientCermService } from '../../../core/services/client-cerm.service';
import { ClientCerm } from '../../../core/models/client-cerm.model';
import { ProspectService } from '../../../core/services/prospect.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css',
})
export class ClientList implements OnInit {
  protected readonly Math = Math;
  searchQuery = signal('');
  pageSize = signal(10);
  currentPage = signal(1);
  pageOptions = [10, 20, 50];

  filteredClients = computed(() => {
    let list = this.clientCermService.clients();
    const q = this.searchQuery().toLowerCase();

    if (q) {
      list = list.filter(
        (c) =>
          (c.nom || '').toLowerCase().includes(q) ||
          (c.id || '').toString().toLowerCase().includes(q) ||
          (c.codeCRM || '').toLowerCase().includes(q)
      );
    }

    return list;
  });

  pagedClients = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredClients().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredClients().length / this.pageSize())));

  constructor(
    public clientCermService: ClientCermService,
    private prospectService: ProspectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientCermService.recherche({ limit: 1000 }).subscribe({
      next: (clients) => console.log('[ClientList] Liste chargée avec succès:', clients),
      error: (err) => console.error('[ClientList] Erreur lors du chargement des clients:', err)
    });
    this.currentPage.set(1);
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  onPageSizeChange(value: string): void {
    this.pageSize.set(Number(value));
    this.currentPage.set(1);
  }

  previousPage(): void {
    this.currentPage.update((page) => Math.max(1, page - 1));
  }

  nextPage(): void {
    this.currentPage.update((page) => Math.min(this.totalPages(), page + 1));
  }

  addProspection(clientId: number): void {
    this.router.navigate(['/prospections/create'], { queryParams: { clientCermId: clientId } });
  }

  viewClient(clientId: number): void {
    this.router.navigate(['/clients', clientId]);
  }

  addReclamation(clientId: number): void {
    this.router.navigate(['/reclamations/create'], { queryParams: { clientId: clientId } });
  }
}
