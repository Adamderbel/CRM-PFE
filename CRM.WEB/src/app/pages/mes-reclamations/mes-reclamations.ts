import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ClientCermService } from '../../core/services/client-cerm.service';
import { ReclamationService } from '../../core/services/reclamation.service';
import { Reclamation } from '../../core/models/reclamation.model';

@Component({
  selector: 'app-mes-reclamations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-reclamations.html',
  styleUrl: './mes-reclamations.css',
})
export class MesReclamations implements OnInit {
  private authService = inject(AuthService);
  private clientService = inject(ClientCermService);
  private reclamationService = inject(ReclamationService);

  reclamations = signal<Reclamation[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    const user = this.authService.user();
    if (!user) {
      this.errorMessage.set('Utilisateur non connecté.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.clientService.getByUserId(user.id).subscribe({
      next: (client) => {
        if (client && client.refClient) {
          this.reclamationService.getByClient(client.refClient).subscribe({
            next: (data) => {
              this.reclamations.set(data ?? []);
              this.isLoading.set(false);
            },
            error: (err) => {
              console.error('Reclamation load error:', err);
              const detail = err?.error?.error || err?.error?.message || err?.message || JSON.stringify(err);
              this.errorMessage.set(`Impossible de charger vos réclamations. (Statut: ${err?.status}, Détails: ${detail})`);
              this.isLoading.set(false);
            },
          });
        } else {
          this.errorMessage.set('Aucun profil client associé trouvé.');
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.errorMessage.set('Impossible de récupérer votre profil client.');
        this.isLoading.set(false);
      },
    });
  }

  getStatutClass(statut?: string): string {
    if (!statut) return '';
    const s = statut.toLowerCase().trim();
    if (s.includes('nouveau')) return 'statut-nouveau';
    if (s.includes('cours')) return 'statut-encours';
    if (s.includes('execut')) return 'statut-execution';
    if (s.includes('control')) return 'statut-controle';
    if (s.includes('cloture') || s.includes('clôtur')) return 'statut-cloture';
    return 'statut-default';
  }

  getPrioriteClass(priorite?: string): string {
    if (!priorite) return '';
    const p = priorite.toLowerCase().trim();
    if (p.includes('haute') || p.includes('urgent')) return 'priorite-haute';
    if (p.includes('basse') || p.includes('faible')) return 'priorite-basse';
    return 'priorite-normale';
  }

  formatDate(dateStr?: string): string {
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
}
