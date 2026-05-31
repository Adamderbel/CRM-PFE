import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ClientCermService } from '../../core/services/client-cerm.service';
import { CommandeService } from '../../core/services/commande.service';
import { Commande } from '../../core/models/commande.model';

@Component({
  selector: 'app-commandes-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commandes-client.html',
  styleUrl: './commandes-client.css'
})
export class CommandesClient implements OnInit {
  private authService = inject(AuthService);
  private clientService = inject(ClientCermService);
  private commandeService = inject(CommandeService);
  private router = inject(Router);

  commandesList = signal<Commande[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadClientAndCommandes();
  }

  loadClientAndCommandes(): void {
    const user = this.authService.user();
    if (!user) {
      this.errorMessage.set('Utilisateur non connecté.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Fetch the client by their Identity User ID
    this.clientService.getByUserId(user.id).subscribe({
      next: (client) => {
        if (client && client.refClient) {
          // Fetch orders using the client's RefClient
          this.commandeService.getByClient(client.refClient.toString()).subscribe({
            next: (commandes) => {
              this.commandesList.set(commandes);
              this.isLoading.set(false);
            },
            error: (err) => {
              this.errorMessage.set('Impossible de charger vos commandes.');
              this.isLoading.set(false);
            }
          });
        } else {
          this.errorMessage.set('Aucun profil client associé trouvé.');
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Error fetching client profile:', err);
        const detail = err.error?.message || err.message || JSON.stringify(err);
        this.errorMessage.set(`Impossible de récupérer vos informations de profil client. (Détails: ${detail}, Statut: ${err.status})`);
        this.isLoading.set(false);
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

  voirLignes(refCommande: string): void {
    this.router.navigate(['/commande-client/lignes', refCommande]);
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
