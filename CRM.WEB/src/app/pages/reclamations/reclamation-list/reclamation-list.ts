import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { Reclamation } from '../../../core/models/reclamation.model';

@Component({
  selector: 'app-reclamation-list',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './reclamation-list.html',
  styleUrl: './reclamation-list.css'
})
export class ReclamationList implements OnInit {
  reclamations = signal<Reclamation[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  // Control popup visibility
  showAnalysePopup = signal(false);
  showExecutionPopup = signal(false);
  showControlePopup = signal(false);
  showCloturePopup = signal(false);
  showConsulterPopup = signal(false);
  selectedReclamation = signal<Reclamation | null>(null);

  // Form fields for analyse
  analyseText = signal('');
  justifiee = signal<boolean>(false);
  commentaireJustification = signal('');

  // Form fields for execution
  dateExecution = signal('');

  // Form fields for controle execution
  dateControleExecution = signal('');
  commentaireControleExecution = signal('');

  // Form fields for cloture
  dateClotureReclamation = signal('');
  rapport = signal('');
  responsableFaute = signal('');
  degats = signal<number | null>(null);

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

  openAnalysePopup(reclamation: Reclamation): void {
    this.selectedReclamation.set(reclamation);
    this.analyseText.set(reclamation.analyseReclamation || '');
    this.justifiee.set(reclamation.justifiee || false);
    this.commentaireJustification.set(reclamation.commentaireJustification || '');
    this.showAnalysePopup.set(true);
  }

  closeAnalysePopup(): void {
    this.showAnalysePopup.set(false);
    this.selectedReclamation.set(null);
  }

  saveAnalyse(): void {
    const reclamation = this.selectedReclamation();
    if (!reclamation || !reclamation.id) return;

    // Update locally
    const updatedReclamation = {
      ...reclamation,
      statut: 'En cours',
      analyseReclamation: this.analyseText(),
      justifiee: this.justifiee(),
      commentaireJustification: this.commentaireJustification()
    };

    this.reclamationService.update(reclamation.id, updatedReclamation).subscribe({
      next: () => {
        this.loadReclamations();
        this.closeAnalysePopup();
      },
      error: (err) => {
        console.error('Error details:', err);
        alert(`Erreur lors de la sauvegarde de l'analyse : ${err.message || 'Voir console'}`);
      }
    });
  }

  openExecutionPopup(reclamation: Reclamation): void {
    this.selectedReclamation.set(reclamation);

    // Convert existing date to YYYY-MM-DD input format if exists
    if (reclamation.dateExecution) {
      const d = new Date(reclamation.dateExecution);
      this.dateExecution.set(d.toISOString().split('T')[0]);
    } else {
      this.dateExecution.set('');
    }

    this.showExecutionPopup.set(true);
  }

  closeExecutionPopup(): void {
    this.showExecutionPopup.set(false);
    this.selectedReclamation.set(null);
  }

  saveExecution(): void {
    const reclamation = this.selectedReclamation();
    if (!reclamation || !reclamation.id) return;

    if (!this.dateExecution()) {
      alert("Veuillez sélectionner une date d'exécution.");
      return;
    }

    const updatedReclamation = {
      ...reclamation,
      statut: 'En execution',
      dateExecution: new Date(this.dateExecution()).toISOString()
    };

    this.reclamationService.update(reclamation.id, updatedReclamation).subscribe({
      next: () => {
        this.loadReclamations();
        this.closeExecutionPopup();
      },
      error: (err) => {
        console.error('Error details:', err);
        alert(`Erreur lors de la sauvegarde de l'exécution : ${err.message || 'Voir console'}`);
      }
    });
  }

  openControlePopup(reclamation: Reclamation): void {
    this.selectedReclamation.set(reclamation);

    // Convert existing date to YYYY-MM-DD input format if exists
    if (reclamation.dateControleExecution) {
      const d = new Date(reclamation.dateControleExecution);
      this.dateControleExecution.set(d.toISOString().split('T')[0]);
    } else {
      this.dateControleExecution.set('');
    }

    this.commentaireControleExecution.set(reclamation.commentaireControleExecution || '');
    this.showControlePopup.set(true);
  }

  closeControlePopup(): void {
    this.showControlePopup.set(false);
    this.selectedReclamation.set(null);
  }

  saveControle(): void {
    const reclamation = this.selectedReclamation();
    if (!reclamation || !reclamation.id) return;

    if (!this.dateControleExecution()) {
      alert("Veuillez sélectionner une date de contrôle.");
      return;
    }

    const updatedReclamation = {
      ...reclamation,
      statut: 'Controle',
      commentaireControleExecution: this.commentaireControleExecution(),
      dateControleExecution: new Date(this.dateControleExecution()).toISOString()
    };

    this.reclamationService.update(reclamation.id, updatedReclamation).subscribe({
      next: () => {
        this.loadReclamations();
        this.closeControlePopup();
      },
      error: (err) => {
        console.error('Error details:', err);
        alert(`Erreur lors de la sauvegarde du contrôle : ${err.message || 'Voir console'}`);
      }
    });
  }

  openCloturePopup(reclamation: Reclamation): void {
    this.selectedReclamation.set(reclamation);

    if (reclamation.dateClotureReclamation) {
      const d = new Date(reclamation.dateClotureReclamation);
      this.dateClotureReclamation.set(d.toISOString().split('T')[0]);
    } else {
      this.dateClotureReclamation.set('');
    }

    this.rapport.set(reclamation.rapport || '');
    this.responsableFaute.set(reclamation.responsableFaute || '');
    this.degats.set(reclamation.degats || null);

    this.showCloturePopup.set(true);
  }

  closeCloturePopup(): void {
    this.showCloturePopup.set(false);
    this.selectedReclamation.set(null);
  }

  saveCloture(): void {
    const reclamation = this.selectedReclamation();
    if (!reclamation || !reclamation.id) return;

    if (!this.dateClotureReclamation()) {
      alert("Veuillez sélectionner une date de clôture.");
      return;
    }

    const updatedReclamation = {
      ...reclamation,
      statut: 'Cloturé',
      dateClotureReclamation: new Date(this.dateClotureReclamation()).toISOString(),
      rapport: this.rapport(),
      responsableFaute: this.responsableFaute(),
      degats: this.degats() ?? undefined
    };

    this.reclamationService.update(reclamation.id, updatedReclamation).subscribe({
      next: () => {
        this.loadReclamations();
        this.closeCloturePopup();
      },
      error: (err) => {
        console.error('Error details:', err);
        alert(`Erreur lors de la sauvegarde de la clôture : ${err.message || 'Voir console'}`);
      }
    });
  }

  openConsulterPopup(reclamation: Reclamation): void {
    this.selectedReclamation.set(reclamation);
    this.showConsulterPopup.set(true);
  }

  closeConsulterPopup(): void {
    this.showConsulterPopup.set(false);
    this.selectedReclamation.set(null);
  }
}
