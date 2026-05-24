import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface CommandeRecente {
  reference: string;
  produit: string;
  date: string;
  statut: 'Livrée' | 'En cours' | 'Confirmée';
  montant: string;
}

interface Activite {
  titre: string;
  date: string;
  type: 'livraison' | 'telechargement' | 'expedition' | 'paiement';
}

interface MonthlySeriesItem {
  label: string;
  value: number;
}

interface BreakdownItem {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-client.html',
  styleUrl: './dashboard-client.css',
})
export class DashboardClient {
  private authService = inject(AuthService);

  readonly monthlyCommandes: MonthlySeriesItem[] = [
    { label: 'Jan', value: 18 },
    { label: 'Fév', value: 24 },
    { label: 'Mar', value: 22 },
    { label: 'Avr', value: 31 },
    { label: 'Mai', value: 36 },
    { label: 'Juin', value: 42 },
    { label: 'Juil', value: 39 },
    { label: 'Août', value: 45 }
  ];

  private readonly statusBreakdown: BreakdownItem[] = [
    { label: 'Livrées', value: 58, color: '#12b76a' },
    { label: 'En cours', value: 24, color: '#2f80ed' },
    { label: 'Confirmées', value: 14, color: '#7c5cfc' },
    { label: 'En attente', value: 8, color: '#ff9800' }
  ];

  private readonly productBreakdown: BreakdownItem[] = [
    { label: 'CRM Entreprise', value: 34, color: '#7c5cfc' },
    { label: 'Support Premium', value: 27, color: '#2196f3' },
    { label: 'Formation', value: 19, color: '#12b76a' },
    { label: 'Personnalisation', value: 12, color: '#ff9800' }
  ];

  readonly monthlyMax = Math.max(...this.monthlyCommandes.map((item) => item.value));
  readonly monthlyPath = this.buildLinePath(this.monthlyCommandes);
  readonly monthlyAreaPath = `${this.monthlyPath} L 100 110 L 0 110 Z`;

  readonly breakdownTotal = this.statusBreakdown.reduce((sum, item) => sum + item.value, 0);
  readonly breakdownGradient = this.buildConicGradient(this.statusBreakdown);
  readonly breakdownItems = this.statusBreakdown;
  readonly productBars = this.productBreakdown;

  // Dynamic naming based on auth context, with fallback to image's mock values
  userName = computed(() => {
    const fullName = this.authService.userFullName();
    if (fullName) {
      const parts = fullName.split(' ');
      return parts[0]; // Extract first name (e.g. "Mohamed")
    }
    return 'Mohamed';
  });

  userFullName = computed(() => this.authService.userFullName() || 'client KALLEL MOHAMED');

  // KPI stats row
  stats = [
    { label: 'Total commandes', value: '128', change: '18.2%', trend: 'up', icon: 'local_mall', color: '#7c5cfc', bg: '#f3e5f5' },
    { label: 'En cours', value: '15', change: '8.1%', trend: 'up', icon: 'schedule', color: '#2196f3', bg: '#e3f2fd' },
    { label: 'Livrées', value: '98', change: '22.7%', trend: 'up', icon: 'check_circle', color: '#4caf50', bg: '#e8f5e9' },
    { label: 'Factures payées', value: '64', change: '16.3%', trend: 'up', icon: 'receipt_long', color: '#ff9800', bg: '#fff3e0' }
  ];

  // Table exact mockup dataset
  commandes: CommandeRecente[] = [
    { reference: 'CMD-2024-00128', produit: 'Solution CRM Entreprise', date: '10 Mai 2024', statut: 'Livrée', montant: '2 450,00 MAD' },
    { reference: 'CMD-2024-00127', produit: 'Support Premium', date: '08 Mai 2024', statut: 'En cours', montant: '980,00 MAD' },
    { reference: 'CMD-2024-00126', produit: 'Formation Utilisateur', date: '06 Mai 2024', statut: 'Confirmée', montant: '1 500,00 MAD' },
    { reference: 'CMD-2024-00125', produit: 'Personnalisation CRM', date: '02 Mai 2024', statut: 'Livrée', montant: '3 200,00 MAD' },
    { reference: 'CMD-2024-00124', produit: 'Maintenance Annuelle', date: '28 Avr. 2024', statut: 'En cours', montant: '1 200,00 MAD' }
  ];

  // Activities feed list
  activites: Activite[] = [
    { titre: 'Commande CMD-2024-00128 livrée', date: '10 Mai 2024 à 14:30', type: 'livraison' },
    { titre: 'Facture FACT-2024-0056 téléchargée', date: '09 Mai 2024 à 11:15', type: 'telechargement' },
    { titre: 'Commande CMD-2024-00127 expédiée', date: '08 Mai 2024 à 16:45', type: 'expedition' },
    { titre: 'Paiement reçu pour FACT-2024-0055', date: '07 Mai 2024 à 09:20', type: 'paiement' }
  ];

  // Quick actions items
  actions = [
    { titre: 'Nouvelle commande', sub: 'Passer commande', icon: 'add_shopping_cart' },
    { titre: 'Télécharger une facture', sub: 'Accéder aux PDF', icon: 'file_download' },
    { titre: 'Contacter le support', sub: 'Nous sommes là', icon: 'support_agent' },
    { titre: 'Mon profil', sub: 'Gérer mes données', icon: 'person' }
  ];

  private buildLinePath(points: MonthlySeriesItem[]): string {
    const width = 280;
    const height = 110;
    const max = Math.max(...points.map((item) => item.value));
    const stepX = width / (points.length - 1);

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
    let current = 0;

    return items
      .map((item) => {
        const start = (current / total) * 100;
        current += item.value;
        const end = (current / total) * 100;
        return `${item.color} ${start}% ${end}%`;
      })
      .join(', ');
  }

  getStatutClass(statut: 'Livrée' | 'En cours' | 'Confirmée'): string {
    switch (statut) {
      case 'Livrée': return 'statut-livree';
      case 'En cours': return 'statut-en-cours';
      case 'Confirmée': return 'statut-confirmee';
      default: return '';
    }
  }
}
