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
}
