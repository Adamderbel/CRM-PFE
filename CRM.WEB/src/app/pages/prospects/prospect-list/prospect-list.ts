import { Component, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProspectService } from '../../../core/services/prospect.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Prospect } from '../../../core/models/prospect.model';

@Component({
  selector: 'app-prospect-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './prospect-list.html',
  styleUrl: './prospect-list.css',
})
export class ProspectList implements OnInit {
  searchQuery = signal('');
  showDeleteConfirm = signal(false);
  prospectToDelete = signal<Prospect | null>(null);
  successMessage = signal('');
  pageSize = signal(10);
  currentPage = signal(1);
  pageOptions = [10, 20, 50];

  filteredProspects = computed(() => {
    let list = this.prospectService.prospects();
    const q = this.searchQuery().toLowerCase();

    if (q) {
      list = list.filter(
        (p) =>
          (p.nom || '').toLowerCase().includes(q) ||
          (p.prenom || '').toLowerCase().includes(q) ||
          (p.email || '').toLowerCase().includes(q) ||
          (p.telephone || '').toString().toLowerCase().includes(q) ||
          (p.source || '').toLowerCase().includes(q)
      );
    }

    return list;
  });

  pagedProspects = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredProspects().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredProspects().length / this.pageSize())));

  constructor(
    public prospectService: ProspectService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProspects();
  }

  loadProspects(): void {
    console.log('[ProspectList] Chargement de la liste des prospects...');
    this.prospectService.getAll().subscribe({
      next: (prospects) => console.log('[ProspectList] Liste chargée avec succès:', prospects),
      error: (err) => console.error('[ProspectList] Erreur lors du chargement de la liste:', err)
    });
    this.currentPage.set(1);
  }

  viewProspect(id: string): void {
    this.router.navigate(['/prospects', id]);
  }

  editProspect(id: string): void {
    this.router.navigate(['/prospects', 'edit', id]);
  }

  addProspection(prospectId: string): void {
    this.router.navigate(['/prospections/create'], { queryParams: { prospectId } });
  }

  confirmDelete(prospect: Prospect): void {
    this.prospectToDelete.set(prospect);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.prospectToDelete.set(null);
  }

  deleteProspect(): void {
    const prospect = this.prospectToDelete();
    if (!prospect) return;

    console.log('[ProspectList] Tentative de suppression du prospect:', prospect);
    this.prospectService.delete(prospect.id).subscribe({
      next: () => {
        console.log('[ProspectList] Prospect supprimé avec succès:', prospect.id);
        this.showDeleteConfirm.set(false);
        this.prospectToDelete.set(null);
        this.successMessage.set('Prospect supprimé avec succès.');
        this.notificationService.success('Prospect supprimé avec succès.');
        setTimeout(() => this.successMessage.set(''), 3000);
        this.loadProspects();
      },
      error: (err) => {
        console.error('[ProspectList] Erreur lors de la suppression du prospect:', err);
        this.notificationService.error('Erreur lors de la suppression du prospect.');
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

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
