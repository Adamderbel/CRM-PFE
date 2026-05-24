import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from '../../core/services/reclamation.service';
import { ReclamationCreateDto } from '../../core/models/reclamation.model';

@Component({
  selector: 'app-reclamation-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reclamation-client.html',
  styleUrl: './reclamation-client.css'
})
export class ReclamationClient implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reclamationService = inject(ReclamationService);

  notes = signal('');
  clientId = signal<number | null>(null);
  produitId = signal<number | null>(null);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const parsedClientId = Number(params.get('clientId'));
    const parsedProduitId = Number(params.get('produitId'));

    if (Number.isNaN(parsedClientId) || Number.isNaN(parsedProduitId)) {
      this.errorMessage.set('Informations de la ligne de commande manquantes.');
      return;
    }

    this.clientId.set(parsedClientId);
    this.produitId.set(parsedProduitId);
  }

  save(): void {
    this.errorMessage.set('');

    if (!this.clientId() || !this.produitId()) {
      this.errorMessage.set('Informations de la ligne de commande manquantes.');
      return;
    }

    const notesValue = this.notes().trim();
    if (!notesValue) {
      this.errorMessage.set('Veuillez saisir vos notes.');
      return;
    }

    const payload: ReclamationCreateDto = {
      titre: 'Réclamation client',
      description: notesValue,
      statut: 'Nouveau',
      priorite: 'Normale',
      source: 'Portail client',
      numeroReference: '',
      clientId: this.clientId()!,
      produitId: this.produitId()!
    };

    this.isSaving.set(true);
    this.reclamationService.create(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set('Réclamation envoyée avec succès.');
        setTimeout(() => this.router.navigate(['/commande-client']), 1500);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err?.error?.error || 'Erreur lors de l\'envoi de la réclamation.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/commande-client']);
  }
}
