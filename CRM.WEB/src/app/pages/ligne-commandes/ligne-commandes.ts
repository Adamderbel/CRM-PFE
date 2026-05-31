import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandeService } from '../../core/services/commande.service';
import { CommandeLigne } from '../../core/models/commande.model';

@Component({
  selector: 'app-ligne-commandes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ligne-commandes.html',
  styleUrl: './ligne-commandes.css'
})
export class LigneCommandes implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private commandeService = inject(CommandeService);

  refCommande = signal<string>('');
  lignes = signal<CommandeLigne[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const ref = this.route.snapshot.paramMap.get('refCommande');
    if (!ref) {
      this.errorMessage.set('Référence de commande manquante.');
      return;
    }

    this.refCommande.set(ref);
    this.loadLignes(ref);
  }

  loadLignes(refCommande: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.commandeService.getLignes(refCommande).subscribe({
      next: (data) => {
        this.lignes.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        const detail = err.error?.message || err.message || JSON.stringify(err);
        this.errorMessage.set(`Impossible de charger les lignes de la commande. (Détails: ${detail})`);
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/commande-client']);
  }

  creerReclamation(ligne: CommandeLigne): void {
    this.router.navigate(['/reclamation-client'], {
      queryParams: {
        clientId: ligne.clientId,
        produitId: ligne.produitId
      }
    });
  }

  getStatutClass(statut?: string): string {
    if (!statut) return '';
    const clean = statut.toLowerCase().trim();
    if (clean.includes('livr') || clean === 'done') return 'statut-livree';
    if (clean.includes('cours') || clean === 'pending') return 'statut-en-cours';
    if (clean.includes('confirm') || clean === 'approved') return 'statut-confirmee';
    return '';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }
}
