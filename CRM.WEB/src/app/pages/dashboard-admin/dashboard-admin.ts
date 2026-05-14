import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import Chart from 'chart.js/auto';

interface Employee {
  id: number;
  name: string;
  avatar: string;
  role: string;
  department: string;
  lastLogin: string;
  status: 'Actif' | 'Inactif';
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin implements OnInit, AfterViewInit {
  @ViewChild('retentionChart') retentionChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('diversityChart') diversityChartRef!: ElementRef<HTMLCanvasElement>;

  private retentionChartInstance: Chart | null = null;
  private diversityChartInstance: Chart | null = null;

  constructor(private authService: AuthService) {}

  userName = computed(() => this.authService.userFullName() || 'Admin');

  currentDate = signal(new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  searchQuery = signal('');

  metrics = [
    { label: 'Total Employés', value: '1 450', icon: 'people', change: '+12%', trend: 'up' },
    { label: 'Employés Actifs', value: '1 385', icon: 'verified_user', change: '+8%', trend: 'up' },
    { label: 'Nouvelles Recrues', value: '52', icon: 'person_add', change: '+15%', trend: 'up' },
    { label: 'Ancienneté Moy.', value: '3,4 ans', icon: 'schedule', change: '+5%', trend: 'up' },
  ];

  employees: Employee[] = [
    { id: 131, name: 'Alex R. Hmth', avatar: 'AH', role: 'Manager', department: 'Ventes', lastLogin: '19 Jan, 19:05', status: 'Actif' },
    { id: 132, name: 'Jonvi Berter', avatar: 'JB', role: 'Développeur', department: 'Marketing', lastLogin: '18 Jan, 19:25', status: 'Actif' },
    { id: 133, name: 'Meeratdhranan', avatar: 'MR', role: 'Designer', department: 'RH', lastLogin: '19 Jan, 09:58', status: 'Actif' },
    { id: 134, name: 'Sara Mitchell', avatar: 'SM', role: 'Analyste', department: 'Tech', lastLogin: '17 Jan, 15:12', status: 'Inactif' },
    { id: 135, name: 'David Chen', avatar: 'DC', role: 'Chef d\'équipe', department: 'Ventes', lastLogin: '19 Jan, 11:30', status: 'Actif' },
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createRetentionChart();
    this.createDiversityChart();
  }

  private createRetentionChart(): void {
    const ctx = this.retentionChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(124, 92, 252, 0.2)');
    gradient.addColorStop(1, 'rgba(124, 92, 252, 0.0)');

    this.retentionChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [
          {
            label: 'Taux de rétention',
            data: [30, 28, 32, 35, 33, 38, 55, 60, 58, 65, 70, 85],
            borderColor: '#7c5cfc',
            backgroundColor: gradient,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#7c5cfc',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
          },
          {
            label: 'Base',
            data: [32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32],
            borderColor: 'rgba(200, 200, 200, 0.5)',
            borderWidth: 1,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
          }
        ],
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
              label: (ctx) => `Stats: ${ctx.raw}%`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0, 0, 0, 0.04)' },
            ticks: { color: '#999', font: { size: 11 } },
            border: { display: false }
          },
          y: {
            min: 20,
            max: 100,
            grid: { color: 'rgba(0, 0, 0, 0.04)' },
            ticks: {
              color: '#999',
              font: { size: 11 },
              callback: (value) => value + '%',
              stepSize: 20
            },
            border: { display: false }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  private createDiversityChart(): void {
    const ctx = this.diversityChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.diversityChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Ventes', 'Tech', 'RH', 'Marketing'],
        datasets: [{
          data: [138, 11, 10, 13],
          backgroundColor: ['#7c5cfc', '#2196f3', '#ff9800', '#4caf50'],
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
              generateLabels: (chart) => {
                const data = chart.data;
                return data.labels!.map((label, i) => ({
                  text: `${label}  ${(data.datasets[0].data[i] as number)}`,
                  fillStyle: (data.datasets[0].backgroundColor as string[])[i],
                  strokeStyle: 'transparent',
                  pointStyle: 'circle',
                  index: i,
                }));
              }
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

  getStatusClass(status: string): string {
    return status === 'Actif' ? 'status-badge status-active' : 'status-badge status-inactive';
  }
}
