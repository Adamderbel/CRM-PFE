import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService, CommercialHistoryItem } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

interface Metric {
  label: string;
  value: string;
  icon: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  userName = computed(() => this.authService.userFullName());

  metrics = signal<Metric[]>([]);
  recentActions = signal<CommercialHistoryItem[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    
    // Load Metrics
    this.dashboardService.getMetrics().subscribe({
      next: (data) => {
        const metrics: Metric[] = [
          { 
            label: 'Prospects', 
            value: data.totalProspects.toLocaleString('fr-FR'), 
            icon: 'people', 
            change: `+${data.nouveauxProspectsMois} ce mois`,
            trend: 'up',
            color: 'primary'
          },
          { 
            label: 'Conversion', 
            value: `${data.tauxConversion}%`, 
            icon: 'trending_up', 
            change: data.tauxConversion >= 50 ? 'Objectif atteint' : 'À améliorer',
            trend: data.tauxConversion >= 50 ? 'up' : 'neutral',
            color: 'success'
          },
          { 
            label: 'En cours', 
            value: data.prospectionsEnCours.toLocaleString('fr-FR'), 
            icon: 'hourglass_empty', 
            change: 'Prospections actives',
            trend: 'neutral',
            color: 'warning'
          },
          { 
            label: 'Réclamations', 
            value: data.totalReclamations.toLocaleString('fr-FR'), 
            icon: 'feedback', 
            change: 'Tickets SAV',
            trend: 'down',
            color: 'info'
          }
        ];
        this.metrics.set(metrics);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Erreur lors du chargement des indicateurs.');
      }
    });

    // Load Recent History
    this.dashboardService.getHistoriqueCommercial(5).subscribe({
      next: (history) => {
        this.recentActions.set(history);
      }
    });
  }
}
