import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DashboardService, CommercialHistoryItem } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-historique-commercial',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './historique-commercial.html',
  styleUrl: './historique-commercial.css',
})
export class HistoriqueCommercial implements OnInit {
  items = signal<CommercialHistoryItem[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  searchQuery = signal('');
  contactTypeFilter = signal<'all' | 'prospect' | 'client'>('all');

  filteredItems = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase('fr');
    const type = this.contactTypeFilter();

    return this.items().filter((item) => {
      if (type !== 'all' && item.contactType !== type) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        item.contactNom,
        item.prospectNomComplet,
        item.typeActionLibelle,
        item.commentaire,
        item.resultat,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('fr')
        .includes(query);
    });
  });

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.dashboardService.getHistoriqueCommercial(200).subscribe({
      next: (data) => {
        this.items.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set("Impossible de charger l'historique commercial.");
        this.isLoading.set(false);
      },
    });
  }
}
