import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, CommercialHistoryItem } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-historique-commercial',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './historique-commercial.html',
  styleUrl: './historique-commercial.css',
})
export class HistoriqueCommercial implements OnInit {
  items = signal<CommercialHistoryItem[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

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
