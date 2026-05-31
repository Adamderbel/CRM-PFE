import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ClientCermService } from '../../core/services/client-cerm.service';
import { CommandeService } from '../../core/services/commande.service';
import { ReclamationService } from '../../core/services/reclamation.service';
import { Commande } from '../../core/models/commande.model';

interface MonthlySeriesItem {
  label: string;
  value: number;
}

interface BreakdownItem {
  label: string;
  value: number;
  color: string;
}

interface StatCard {
  label: string;
  value: string;
  icon: string;
  color: string;
  bg: string;
}

interface CommandeRow {
  reference: string;
  produit: string;
  date: string;
  statut: string;
  statutClass: string;
}

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-client.html',
  styleUrl: './dashboard-client.css',
})
export class DashboardClient implements OnInit {
  private authService = inject(AuthService);
  private clientService = inject(ClientCermService);
  private commandeService = inject(CommandeService);
  private reclamationService = inject(ReclamationService);

  // State
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  private commandes = signal<Commande[]>([]);
  private reclamationsCount = signal(0);

  // Welcome name
  userName = computed(() => {
    const fullName = this.authService.userFullName();
    if (fullName) return fullName.split(' ')[0];
    return 'Client';
  });
  userFullName = computed(() => this.authService.userFullName() || 'Client');

  // KPI stats — derived from commandes + reclamations
  stats = computed<StatCard[]>(() => {
    const all = this.commandes();
    const total = all.length;
    const enCours = all.filter(c => this.isEnCours(c.statutCommande)).length;
    const livrees = all.filter(c => this.isLivree(c.statutCommande)).length;
    const reclam = this.reclamationsCount();

    return [
      { label: 'Total commandes', value: total.toString(), icon: 'local_mall', color: '#7c5cfc', bg: '#f3e5f5' },
      { label: 'En cours', value: enCours.toString(), icon: 'schedule', color: '#2196f3', bg: '#e3f2fd' },
      { label: 'Livrées', value: livrees.toString(), icon: 'check_circle', color: '#4caf50', bg: '#e8f5e9' },
      { label: 'Mes réclamations', value: reclam.toString(), icon: 'report_problem', color: '#ff9800', bg: '#fff3e0' },
    ];
  });

  // Monthly commandes — last 8 months from real data
  monthlyCommandes = computed<MonthlySeriesItem[]>(() => {
    const all = this.commandes();
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const now = new Date();
    const buckets: MonthlySeriesItem[] = [];

    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ label: monthNames[d.getMonth()], value: 0 });
    }

    for (const c of all) {
      if (!c.dateCommande) continue;
      const d = new Date(c.dateCommande);
      if (isNaN(d.getTime())) continue;
      const diffMonths = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (diffMonths >= 0 && diffMonths < 8) {
        buckets[7 - diffMonths].value++;
      }
    }
    return buckets;
  });

  monthlyMax = computed(() => Math.max(1, ...this.monthlyCommandes().map(m => m.value)));
  monthlyPath = computed(() => this.buildLinePath(this.monthlyCommandes()));
  monthlyAreaPath = computed(() => `${this.monthlyPath()} L 280 110 L 0 110 Z`);

  // Status breakdown — real data
  breakdownItems = computed<BreakdownItem[]>(() => {
    const all = this.commandes();
    if (all.length === 0) return [];

    const groups: Record<string, number> = {};
    for (const c of all) {
      const key = (c.statutCommande || 'Inconnu').trim();
      groups[key] = (groups[key] || 0) + 1;
    }

    const colorMap: Record<string, string> = {
      livree: '#12b76a',
      livrée: '#12b76a',
      done: '#12b76a',
      en_cours: '#2f80ed',
      'en cours': '#2f80ed',
      pending: '#2f80ed',
      confirmee: '#7c5cfc',
      confirmée: '#7c5cfc',
      approved: '#7c5cfc',
      attente: '#ff9800',
      inconnu: '#9e9e9e',
    };
    const fallback = ['#7c5cfc', '#2196f3', '#12b76a', '#ff9800', '#ef4444', '#9e9e9e'];

    return Object.entries(groups).map(([label, value], i) => {
      const key = label.toLowerCase().trim().replace(/\s+/g, '_');
      const color = colorMap[key] || colorMap[label.toLowerCase()] || fallback[i % fallback.length];
      return { label, value, color };
    });
  });

  breakdownTotal = computed(() => this.breakdownItems().reduce((s, i) => s + i.value, 0));
  breakdownGradient = computed(() => this.buildConicGradient(this.breakdownItems()));

  // Recent commandes table — top 5 by date desc
  recentCommandes = computed<CommandeRow[]>(() => {
    return [...this.commandes()]
      .sort((a, b) => {
        const da = a.dateCommande ? new Date(a.dateCommande).getTime() : 0;
        const db = b.dateCommande ? new Date(b.dateCommande).getTime() : 0;
        return db - da;
      })
      .slice(0, 5)
      .map(c => ({
        reference: c.referenceCommande || c.refCommande,
        produit: c.siteId || '-',
        date: this.formatDate(c.dateCommande),
        statut: c.statutCommande || '-',
        statutClass: this.getStatutClass(c.statutCommande),
      }));
  });

  ngOnInit(): void {
    const user = this.authService.user();
    if (!user) {
      this.errorMessage.set('Utilisateur non connecté.');
      this.isLoading.set(false);
      return;
    }

    this.clientService.getByUserId(user.id).subscribe({
      next: (client) => {
        if (!client || !client.refClient) {
          this.errorMessage.set('Aucun profil client associé trouvé.');
          this.isLoading.set(false);
          return;
        }

        const refClient = client.refClient;

        // Load commandes
        this.commandeService.getByClient(refClient.toString()).subscribe({
          next: (data) => {
            this.commandes.set(data ?? []);
            this.isLoading.set(false);
          },
          error: () => {
            this.errorMessage.set('Impossible de charger vos commandes.');
            this.isLoading.set(false);
          },
        });

        // Load reclamations count (independent, non-blocking)
        this.reclamationService.getByClient(refClient).subscribe({
          next: (rec) => this.reclamationsCount.set(rec?.length ?? 0),
          error: () => this.reclamationsCount.set(0),
        });
      },
      error: () => {
        this.errorMessage.set('Impossible de récupérer votre profil client.');
        this.isLoading.set(false);
      },
    });
  }

  // ---------- helpers ----------

  private isEnCours(statut?: string): boolean {
    if (!statut) return false;
    const s = statut.toLowerCase().trim();
    return s.includes('cours') || s === 'pending' || s.includes('attente');
  }

  private isLivree(statut?: string): boolean {
    if (!statut) return false;
    const s = statut.toLowerCase().trim();
    return s.includes('livr') || s === 'done';
  }

  private buildLinePath(points: MonthlySeriesItem[]): string {
    if (points.length === 0) return '';
    const width = 280;
    const height = 110;
    const max = Math.max(1, ...points.map(item => item.value));
    const stepX = width / Math.max(1, points.length - 1);

    return points
      .map((point, index) => {
        const x = index * stepX;
        const y = height - (point.value / max) * height;
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }

  private buildConicGradient(items: BreakdownItem[]): string {
    const total = items.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return '#eee 0% 100%';
    let current = 0;
    return items
      .map(item => {
        const start = (current / total) * 100;
        current += item.value;
        const end = (current / total) * 100;
        return `${item.color} ${start}% ${end}%`;
      })
      .join(', ');
  }

  getStatutClass(statut?: string): string {
    if (!statut) return '';
    if (this.isLivree(statut)) return 'statut-livree';
    if (this.isEnCours(statut)) return 'statut-en-cours';
    const s = statut.toLowerCase();
    if (s.includes('confirm') || s === 'approved') return 'statut-confirmee';
    return '';
  }

  private formatDate(dateStr?: string): string {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }

  cxFor(i: number): number {
    const total = this.monthlyCommandes().length;
    return i * (280 / Math.max(1, total - 1));
  }

  cyFor(value: number): number {
    return 110 - (value / this.monthlyMax()) * 110;
  }
}
