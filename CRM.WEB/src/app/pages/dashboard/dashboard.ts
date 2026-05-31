import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { DashboardAdminService, DashboardStats, RecentProspection } from '../../core/services/dashboard-admin.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('prospectionsStatusChart') prospectionsStatusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyTrendChart') monthlyTrendChartRef!: ElementRef<HTMLCanvasElement>;

  private prospectionsStatusChartInstance: Chart | null = null;
  private monthlyTrendChartInstance: Chart | null = null;

  private statsData: DashboardStats | null = null;
  private chartsReady = false;

  readonly currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardAdminService
  ) {}

  userName = computed(() => this.authService.userFullName() || 'Commercial');

  searchQuery = signal('');
  isLoading = signal(true);

  metrics = signal([
    { label: 'Total Prospections', value: '-', icon: 'business_center' },
    { label: 'Prospections Gagnées', value: '-', icon: 'emoji_events' },
    { label: 'Prospections en Cours', value: '-', icon: 'pending_actions' },
  ]);

  recentProspections = signal<RecentProspection[]>([]);

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.statsData = data;
        this.metrics.set([
          { label: 'Total Prospections', value: data.totalProspections.toString(), icon: 'business_center' },
          { label: 'Prospections Gagnées', value: data.prospectionsGagnees.toString(), icon: 'emoji_events' },
          { label: 'Prospections en Cours', value: data.prospectionsEnCours.toString(), icon: 'pending_actions' },
        ]);
        this.recentProspections.set(data.recentProspections);
        this.isLoading.set(false);
        if (this.chartsReady) this.buildCharts(data);
      },
      error: () => this.isLoading.set(false)
    });
  }

  ngAfterViewInit(): void {
    this.chartsReady = true;
    if (this.statsData) this.buildCharts(this.statsData);
  }

  ngOnDestroy(): void {
    this.prospectionsStatusChartInstance?.destroy();
    this.monthlyTrendChartInstance?.destroy();
  }

  private readonly STATUS_COLORS = ['#7c5cfc', '#2196f3', '#ff9800', '#f59e0b', '#10b981', '#ef4444'];

  private buildCharts(data: DashboardStats): void {
    this.createProspectionsStatusChart(data);
    this.createMonthlyTrendChart(data);
  }

  private createProspectionsStatusChart(data: DashboardStats): void {
    const ctx = this.prospectionsStatusChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;

    this.prospectionsStatusChartInstance?.destroy();
    this.prospectionsStatusChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.prospectionsByStatus.map(s => s.libelle ?? ''),
        datasets: [{
          label: 'Prospections',
          data: data.prospectionsByStatus.map(s => s.count),
          backgroundColor: this.STATUS_COLORS,
          borderRadius: 6,
          borderSkipped: false,
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
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#999', font: { size: 11 } },
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

  private createMonthlyTrendChart(data: DashboardStats): void {
    const ctx = this.monthlyTrendChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, 'rgba(124, 92, 252, 0.2)');
    gradient.addColorStop(1, 'rgba(124, 92, 252, 0.0)');

    this.monthlyTrendChartInstance?.destroy();
    this.monthlyTrendChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.monthlyTrend.map(m => m.month),
        datasets: [{
          label: 'Prospections Gagnées',
          data: data.monthlyTrend.map(m => m.count),
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
