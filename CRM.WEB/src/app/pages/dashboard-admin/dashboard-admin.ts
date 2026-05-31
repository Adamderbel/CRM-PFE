import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { DashboardAdminService, DashboardStats, AdminStats, RoleCount, RecentProspection } from '../../core/services/dashboard-admin.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('reclamationsStatutChart') reclamationsStatutChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyProspectionsChart') monthlyProspectionsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topProduitsChart') topProduitsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('usersByRoleChart') usersByRoleChartRef!: ElementRef<HTMLCanvasElement>;

  private reclamationsStatutChartInstance: Chart | null = null;
  private monthlyProspectionsChartInstance: Chart | null = null;
  private topProduitsChartInstance: Chart | null = null;
  private usersByRoleChartInstance: Chart | null = null;

  private adminStats: AdminStats | null = null;
  private usersByRole: RoleCount[] | null = null;
  private chartsReady = false;

  readonly currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardAdminService
  ) {}

  userName = computed(() => this.authService.userFullName() || 'Admin');

  currentDate = signal(new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  searchQuery = signal('');
  isLoading = signal(true);

  metrics = signal([
    { label: 'Total Prospections', value: '-', icon: 'business_center' },
    { label: 'Prospections Gagnées', value: '-', icon: 'emoji_events' },
    { label: 'Prospections en Cours', value: '-', icon: 'pending_actions' },
  ]);

  recentProspections = signal<RecentProspection[]>([]);

  ngOnInit(): void {
    // KPIs + recent prospections table
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.metrics.set([
          { label: 'Total Prospections', value: data.totalProspections.toString(), icon: 'business_center' },
          { label: 'Prospections Gagnées', value: data.prospectionsGagnees.toString(), icon: 'emoji_events' },
          { label: 'Prospections en Cours', value: data.prospectionsEnCours.toString(), icon: 'pending_actions' },
        ]);
        this.recentProspections.set(data.recentProspections);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });

    // Admin charts (C, D, E)
    this.dashboardService.getAdminStats().subscribe({
      next: (data) => {
        this.adminStats = data;
        if (this.chartsReady) this.buildCharts(data);
      },
      error: () => {}
    });

    // Users by role (bar)
    this.dashboardService.getUsersByRole().subscribe({
      next: (data) => {
        this.usersByRole = data;
        if (this.chartsReady) this.createUsersByRoleChart(data);
      },
      error: () => {}
    });
  }

  ngAfterViewInit(): void {
    this.chartsReady = true;
    if (this.adminStats) {
      this.buildCharts(this.adminStats);
    }
    if (this.usersByRole) {
      this.createUsersByRoleChart(this.usersByRole);
    }
  }

  ngOnDestroy(): void {
    this.reclamationsStatutChartInstance?.destroy();
    this.monthlyProspectionsChartInstance?.destroy();
    this.topProduitsChartInstance?.destroy();
    this.usersByRoleChartInstance?.destroy();
  }

  private readonly STATUS_COLORS = ['#7c5cfc', '#2196f3', '#ff9800', '#f59e0b', '#10b981', '#ef4444'];

  private buildCharts(data: AdminStats): void {
    this.createReclamationsStatutChart(data);
    this.createMonthlyProspectionsChart(data);
    this.createTopProduitsChart(data);
  }

  // C. Réclamations par statut (doughnut)
  private createReclamationsStatutChart(data: AdminStats): void {
    const ctx = this.reclamationsStatutChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;
    if (data.reclamationsByStatut.length === 0) return;

    this.reclamationsStatutChartInstance?.destroy();
    this.reclamationsStatutChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.reclamationsByStatut.map(s => s.statut),
        datasets: [{
          data: data.reclamationsByStatut.map(s => s.count),
          backgroundColor: this.STATUS_COLORS,
          borderColor: '#fff',
          borderWidth: 3,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#666',
              font: { size: 12 },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
            }
          },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#1e1b3a',
            bodyColor: '#666',
            borderColor: '#eee',
            borderWidth: 1,
            padding: 12,
          }
        }
      }
    });
  }

  // D. Tendance globale — toutes prospections par mois (line)
  private createMonthlyProspectionsChart(data: AdminStats): void {
    const ctx = this.monthlyProspectionsChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, 'rgba(124, 92, 252, 0.2)');
    gradient.addColorStop(1, 'rgba(124, 92, 252, 0.0)');

    this.monthlyProspectionsChartInstance?.destroy();
    this.monthlyProspectionsChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.monthlyProspections.map(m => m.month),
        datasets: [{
          label: 'Prospections',
          data: data.monthlyProspections.map(m => m.count),
          borderColor: '#7c5cfc',
          backgroundColor: gradient,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#7c5cfc',
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#7c5cfc',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#1e1b3a',
            bodyColor: '#666',
            borderColor: '#eee',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { color: '#999', font: { size: 11 } },
            border: { display: false }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { color: '#999', font: { size: 11 }, stepSize: 1 },
            border: { display: false },
            beginAtZero: true,
          }
        },
        interaction: { intersect: false, mode: 'index' }
      }
    });
  }

  // E. Top produits réclamés (horizontal bar)
  private createTopProduitsChart(data: AdminStats): void {
    const ctx = this.topProduitsChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;
    if (data.topProduitsReclames.length === 0) return;

    this.topProduitsChartInstance?.destroy();
    this.topProduitsChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.topProduitsReclames.map(p => p.produit),
        datasets: [{
          label: 'Réclamations',
          data: data.topProduitsReclames.map(p => p.count),
          backgroundColor: this.STATUS_COLORS,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#1e1b3a',
            bodyColor: '#666',
            borderColor: '#eee',
            borderWidth: 1,
            padding: 12,
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { color: '#999', font: { size: 11 }, stepSize: 1 },
            border: { display: false },
            beginAtZero: true,
          },
          y: {
            grid: { display: false },
            ticks: { color: '#999', font: { size: 11 } },
            border: { display: false }
          }
        }
      }
    });
  }

  // Utilisateurs par rôle (vertical bar)
  private createUsersByRoleChart(data: RoleCount[]): void {
    const ctx = this.usersByRoleChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;

    const roleLabels: Record<string, string> = {
      ADMIN: 'Admins',
      COMMERCIAL: 'Commerciaux',
      CLIENT_USER: 'Clients',
    };

    this.usersByRoleChartInstance?.destroy();
    this.usersByRoleChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => roleLabels[d.role] ?? d.role),
        datasets: [{
          label: 'Utilisateurs',
          data: data.map(d => d.count),
          backgroundColor: ['#7c5cfc', '#2196f3', '#10b981'],
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 70,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#1e1b3a',
            bodyColor: '#666',
            borderColor: '#eee',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (ctx) => ` ${ctx.raw} utilisateur(s)`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#1e1b3a', font: { size: 13, weight: 600 } },
            border: { display: false }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { color: '#999', font: { size: 11 }, stepSize: 1 },
            border: { display: false },
            beginAtZero: true,
          }
        }
      }
    });
  }

  getStatutClass(statutId: number | null | undefined): string {
    const classes: Record<number, string> = {
      1: 'statut-nouveau',
      2: 'statut-qualification',
      3: 'statut-proposition',
      4: 'statut-negociation',
      5: 'statut-gagne',
      6: 'statut-perdu',
    };
    return `status-badge ${classes[statutId ?? 0] ?? ''}`;
  }

  getProspectInitials(name: string): string {
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }
}
