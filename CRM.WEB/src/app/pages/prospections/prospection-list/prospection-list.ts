import { Component, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProspectionService } from '../../../core/services/prospection.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Prospection } from '../../../core/models/prospection.model';

@Component({
  selector: 'app-prospection-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './prospection-list.html',
  styleUrl: './prospection-list.css',
})
export class ProspectionList implements OnInit {
  searchQuery = signal('');
  showDeleteConfirm = signal(false);
  prospectionToDelete = signal<Prospection | null>(null);
  successMessage = signal('');
  prospectId = signal<string | null>(null);
  clientId = signal<number | null>(null);
  pageSize = signal(10);
  currentPage = signal(1);
  pageOptions = [10, 20, 50];

  filteredProspections = computed(() => {
    let list = this.prospectionService.prospections();
    const q = this.searchQuery().toLowerCase();

    if (q) {
      list = list.filter(
        (p) =>
          p.prospect?.nom?.toLowerCase().includes(q) ||
          p.prospect?.prenom?.toLowerCase().includes(q) ||
          p.client?.nom?.toLowerCase().includes(q) ||
          p.statut?.libelle?.toLowerCase().includes(q)
      );
    }

    return list;
  });

  pagedProspections = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredProspections().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredProspections().length / this.pageSize())));

  constructor(
    public prospectionService: ProspectionService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const pId = params['prospectId'];
      const rawClientId = params['clientId'] ?? params['clientCermId'];
      if (pId) {
        this.prospectId.set(pId);
        this.clientId.set(null);
        this.loadProspectionsByProspect(pId);
      } else if (rawClientId) {
        const clientId = Number(rawClientId);
        this.prospectId.set(null);
        this.clientId.set(clientId);
        this.loadProspectionsByClient(clientId);
      } else {
        this.prospectId.set(null);
        this.clientId.set(null);
        this.loadProspections();
      }
    });
  }

  loadProspections(): void {
    console.log('[ProspectionList] Chargement de toutes les prospections...');
    this.currentPage.set(1);
    this.prospectionService.getAll().subscribe({
      next: (res) => console.log('[ProspectionList] Prospections chargées:', res),
      error: (err) => console.error('[ProspectionList] Erreur de chargement:', err)
    });
  }

  loadProspectionsByProspect(prospectId: string): void {
    console.log('[ProspectionList] Chargement des prospections pour le prospect:', prospectId);
    this.currentPage.set(1);
    this.prospectionService.getByProspectId(prospectId).subscribe({
      next: (res) => console.log('[ProspectionList] Prospections du prospect chargées:', res),
      error: (err) => console.error('[ProspectionList] Erreur de chargement prospect:', err)
    });
  }

  loadProspectionsByClient(clientId: number): void {
    this.currentPage.set(1);
    this.prospectionService.getByClientId(clientId).subscribe({
      error: (err) => console.error('[ProspectionList] Erreur de chargement client:', err)
    });
  }

  createQueryParams(): Record<string, string | number> | null {
    if (this.prospectId()) return { prospectId: this.prospectId()! };
    if (this.clientId()) return { clientCermId: this.clientId()! };
    return null;
  }

  editProspection(id: string): void {
    this.router.navigate(['/prospections', 'edit', id]);
  }
  viewProspection(id: string): void {
    this.router.navigate(['/prospections/detail', id]);
  }
  viewLignes(id: string): void {
    this.router.navigate(['/ligne-prospections', id]);
  }
  confirmDelete(prospection: Prospection): void {
    this.prospectionToDelete.set(prospection);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.prospectionToDelete.set(null);
  }

  deleteProspection(): void {
    const prospection = this.prospectionToDelete();
    if (!prospection) return;

    console.log('[ProspectionList] Tentative de suppression de la prospection:', prospection.id);
    this.prospectionService.delete(prospection.id).subscribe({
      next: () => {
        console.log('[ProspectionList] Prospection supprimée avec succès');
        this.showDeleteConfirm.set(false);
        this.prospectionToDelete.set(null);
        this.successMessage.set('Prospection supprimée avec succès.');
        this.notificationService.success('Prospection supprimée avec succès.');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        console.error('[ProspectionList] Erreur lors de la suppression:', err);
        this.notificationService.error('Erreur lors de la suppression de la prospection.');
      },
    });
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

  formatDate(date: string | Date | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
