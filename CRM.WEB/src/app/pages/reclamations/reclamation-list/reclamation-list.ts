import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { Reclamation } from '../../../core/models/reclamation.model';

@Component({
  selector: 'app-reclamation-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './reclamation-list.html',
  styleUrl: './reclamation-list.css'
})
export class ReclamationList implements OnInit {
  reclamations = signal<Reclamation[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  
  // Modal State
  showDeleteModal = signal(false);
  selectedReclamationId = signal<string | null>(null);

  constructor(private reclamationService: ReclamationService) { }

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.isLoading.set(true);
    this.reclamationService.getAll().subscribe({
      next: (data) => {
        this.reclamations.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement des réclamations.');
        this.isLoading.set(false);
      }
    });
  }

  deleteReclamation(id: string): void {
    this.selectedReclamationId.set(id);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const id = this.selectedReclamationId();
    if (id) {
      this.reclamationService.delete(id).subscribe({
        next: () => {
          this.reclamations.set(this.reclamations().filter(r => r.id !== id));
          this.closeModal();
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Une erreur est survenue lors de la suppression.');
          this.closeModal();
        }
      });
    }
  }

  closeModal(): void {
    this.showDeleteModal.set(false);
    this.selectedReclamationId.set(null);
  }
}
