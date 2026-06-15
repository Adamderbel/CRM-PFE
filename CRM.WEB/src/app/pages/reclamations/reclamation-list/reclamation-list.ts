import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserService } from '../../../core/services/user.service';
import { Reclamation } from '../../../core/models/reclamation.model';
import { UserDto } from '../../../core/models/user.model';

@Component({
  selector: 'app-reclamation-list',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './reclamation-list.html',
  styleUrl: './reclamation-list.css'
})
export class ReclamationList implements OnInit {
  reclamations = signal<Reclamation[]>([]);
  users = signal<UserDto[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  searchQuery = signal('');
  statusFilter = signal('');
  pageSize = signal(10);
  currentPage = signal(1);
  pageOptions = [10, 20, 50];

  // Process Modal state
  showProcessModal = signal(false);
  selectedReclamation = signal<Reclamation | null>(null);
  processStatus = signal('');
  processResponsibleId = signal<string | null>(null);
  isProcessing = signal(false);

  // Delete Modal state
  showDeleteModal = signal(false);
  reclamationToDelete = signal<Reclamation | null>(null);

  filteredReclamations = computed(() => {
    let list = this.reclamations();
    const q = this.searchQuery().toLowerCase();
    const status = this.normalizeStatus(this.statusFilter());

    if (q) {
      list = list.filter((rec) =>
        [rec.numeroReference, rec.titre, rec.nomClient, rec.designationProduit, rec.statut, rec.priorite]
          .some((value) => (value || '').toLowerCase().includes(q))
      );
    }

    if (status) {
      list = list.filter((rec) => this.normalizeStatus(rec.statut) === status);
    }

    return list;
  });

  pagedReclamations = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredReclamations().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredReclamations().length / this.pageSize())));

  constructor(
    private reclamationService: ReclamationService,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadReclamations();
    this.loadUsers();
  }

  loadReclamations(): void {
    console.log('[ReclamationList] Chargement des réclamations...');
    this.isLoading.set(true);
    this.reclamationService.getAll().subscribe({
      next: (data) => {
        console.log('[ReclamationList] Réclamations chargées:', data);
        this.reclamations.set(data);
        this.isLoading.set(false);
        this.currentPage.set(1);
      },
      error: (err: HttpErrorResponse) => {
        console.error('[ReclamationList] Erreur de chargement:', err);
        this.errorMessage.set('Erreur lors du chargement des réclamations.');
        this.notificationService.error('Erreur lors du chargement des réclamations.');
        this.isLoading.set(false);
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => this.users.set(data),
      error: (err: HttpErrorResponse) => console.error('Erreur chargement users', err)
    });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  onStatusChange(value: string): void {
    this.statusFilter.set(value);
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

  private normalizeStatus(value: string | null | undefined): string {
    return (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  openProcessModal(rec: Reclamation): void {
    this.selectedReclamation.set(rec);
    this.processStatus.set(rec.statut || '');
    this.processResponsibleId.set(rec.responsableId || null);
    this.showProcessModal.set(true);
  }

  closeProcessModal(): void {
    this.showProcessModal.set(false);
    this.selectedReclamation.set(null);
  }

  saveProcess(): void {
    const rec = this.selectedReclamation();
    if (!rec) return;

    console.log('[ReclamationList] Tentative de traitement de la réclamation:', rec.id);
    this.isProcessing.set(true);

    // Construction du DTO propre pour correspondre à ReclamationDtoCreate du backend
    const updateDto = {
      titre: rec.titre,
      description: rec.description,
      statut: this.processStatus(),
      priorite: rec.priorite,
      source: rec.source,
      numeroReference: rec.numeroReference,
      clientId: Number(rec.clientId),
      produitId: Number(rec.produitId),
      responsableId: this.processResponsibleId() || null
    };

    console.log('[ReclamationList] Payload envoyé au serveur:', updateDto);

    this.reclamationService.update(rec.id, updateDto).subscribe({
      next: (res) => {
        console.log('[ReclamationList] Réclamation traitée avec succès:', res);
        this.notificationService.success('Réclamation mise à jour avec succès.');
        this.loadReclamations();
        this.closeProcessModal();
        this.isProcessing.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('[ReclamationList] Erreur lors du traitement de la réclamation:', err);
        if (err.status === 400 && err.error && err.error.errors) {
          console.error('[ReclamationList] Détails des erreurs de validation (brut):', JSON.stringify(err.error.errors, null, 2));
          Object.keys(err.error.errors).forEach(key => {
            console.error(`[ReclamationList] Erreur sur ${key}:`, err.error.errors[key]);
          });
        }
        this.notificationService.error('Erreur lors du traitement.');
        this.isProcessing.set(false);
      }
    });
  }

  editReclamation(id: string): void {
    this.router.navigate(['/reclamations/edit', id]);
  }

  confirmDelete(rec: Reclamation): void {
    this.reclamationToDelete.set(rec);
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.reclamationToDelete.set(null);
  }

  deleteReclamation(): void {
    const rec = this.reclamationToDelete();
    if (!rec) return;

    this.reclamationService.delete(rec.id).subscribe({
      next: () => {
        this.notificationService.success('Réclamation supprimée.');
        this.loadReclamations();
        this.cancelDelete();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur suppression réclamation', err);
        const message = err.error?.details || err.error?.error || 'Erreur lors de la suppression.';
        this.notificationService.error(message);
      }
    });
  }
}
