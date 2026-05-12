import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LigneProspectionService } from '../../../core/services/ligne-prospection.service';

@Component({
  selector: 'app-ligne-prospection-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ligne-prospection-list.html',
  styleUrl: './ligne-prospection-list.css'
})
export class LigneProspectionList implements OnInit {
  isDevisModalOpen = signal<boolean>(false);
  devisData = signal<{ notes: string; email: string; date: string; ligne: any }>({
    notes: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    ligne: null
  });

  prospectionId = signal<string | null>(null);
  searchQuery = signal('');

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
        lp.statut?.libelle?.toLowerCase().includes(q)
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
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  openDevisModal(ligne: any): void {
    this.devisData.set({
      notes: '',
      email: '',
      date: new Date().toISOString().split('T')[0], // current date auto
      ligne: ligne
    });
    this.isDevisModalOpen.set(true);
  }

  closeDevisModal(): void {
    this.isDevisModalOpen.set(false);
  }

  submitDevis(): void {
    const data = this.devisData();
    if (!data.ligne) return;

    console.log('Sending Devis request with data:', data);

    // Call the service to send the quote request
    this.ligneProspectionService.demanderDevis(data.ligne.id, {
      date: data.date,
      email: data.email,
      notes: data.notes
    }).subscribe({
      next: (res) => {
        console.log('Devis demandé avec succès', res);
        alert('Demande de devis envoyée avec succès !');
        this.closeDevisModal();
      },
      error: (err) => {
        console.error('Erreur', err);
        alert('Erreur lors de l\'envoi de la demande de devis.');
        // close modal anyway or let the user try again
      }
    });
  }
}
