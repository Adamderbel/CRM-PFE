import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LigneProspectionService } from '../../../core/services/ligne-prospection.service';
import { LigneProspection } from '../../../core/models/ligne-prospection.model';

@Component({
  selector: 'app-ligne-prospection-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ligne-prospection-list.html',
  styleUrl: './ligne-prospection-list.css'
})
export class LigneProspectionList implements OnInit {
  prospectionId = signal<string | null>(null);
  searchQuery = signal('');
  selectedLigne = signal<LigneProspection | null>(null);
  devisEmail = signal('');
  devisDate = signal('');
  devisNotes = signal('');
  isSendingDevis = signal(false);
  actionError = signal('');
  actionSuccess = signal('');

  filteredLignes = computed(() => {
    let list = this.ligneProspectionService.ligneProspections();

    // Filter by prospectionId if one is selected
    if (this.prospectionId()) {
      list = list.filter(lp => lp.prospectionId === this.prospectionId());
    }

    const q = this.searchQuery().toLowerCase();
    if (q) {
      list = list.filter(lp =>
        lp.designation?.toLowerCase().includes(q) ||
        lp.statut?.libelle?.toLowerCase().includes(q) ||
        lp.societe?.nom?.toLowerCase().includes(q) ||
        lp.societee?.nom?.toLowerCase().includes(q)
      );
    }

    return list;
  });

  constructor(
    public ligneProspectionService: LigneProspectionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if a specific prospection ID was passed
    this.route.paramMap.subscribe(params => {
      const pid = params.get('prospectionId');
      if (pid) {
        this.prospectionId.set(pid);
      }
      this.ligneProspectionService.getAll().subscribe();
    });
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'Non';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  societeName(ligne: LigneProspection): string {
    return ligne.societe?.nom?.trim() || ligne.societee?.nom?.trim() || 'Non renseignée';
  }

  openDevisModal(ligne: LigneProspection): void {
    this.selectedLigne.set(ligne);
    this.devisDate.set(new Date().toISOString().slice(0, 10));
    this.devisEmail.set('');
    this.devisNotes.set('');
    this.actionError.set('');
    this.actionSuccess.set('');
  }

  closeDevisModal(): void {
    if (!this.isSendingDevis()) {
      this.selectedLigne.set(null);
    }
  }

  sendDevisRequest(): void {
    const ligne = this.selectedLigne();
    if (!ligne || !this.devisEmail().trim() || !this.devisDate()) {
      this.actionError.set("L'email du destinataire et la date sont obligatoires.");
      return;
    }

    this.isSendingDevis.set(true);
    this.actionError.set('');

    this.ligneProspectionService.demanderDevis(ligne.id, {
      email: this.devisEmail().trim(),
      date: this.devisDate(),
      notes: this.devisNotes().trim()
    }).subscribe({
      next: () => {
        this.isSendingDevis.set(false);
        this.selectedLigne.set(null);
        this.actionSuccess.set('La demande de devis a été envoyée.');
        this.ligneProspectionService.getAll().subscribe();
      },
      error: (error) => {
        this.isSendingDevis.set(false);
        this.actionError.set(error.message || "Erreur lors de l'envoi de la demande.");
      }
    });
  }
}
