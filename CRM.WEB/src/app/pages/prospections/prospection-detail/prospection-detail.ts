import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProspectionService } from '../../../core/services/prospection.service';
import { Prospection } from '../../../core/models/prospection.model';
import { ActionProspectionService } from '../../../core/services/action-prospection.service';
import { ActionsProspection, TypeActionProspection } from '../../../core/models/action-prospection.model';

@Component({
  selector: 'app-prospection-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './prospection-detail.html',
  styleUrl: './prospection-detail.css',
})
export class ProspectionDetail implements OnInit {
  prospection = signal<Prospection | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  typesActions = signal<TypeActionProspection[]>([]);
  actions = signal<ActionsProspection[]>([]);

  /** Formulaire nouvelle action */
  typeActionId: number | null = null;
  commentaire = '';
  resultat = '';
  savingAction = signal(false);
  actionFeedback = signal('');

  constructor(
    private route: ActivatedRoute,
    private prospectionService: ProspectionService,
    private actionProspectionService: ActionProspectionService
  ) {}

  ngOnInit(): void {
    this.actionProspectionService.getTypesActions().subscribe({
      next: (t) => this.typesActions.set(t),
      error: () => this.typesActions.set([]),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProspection(id);
    } else {
      this.errorMessage.set('Identifiant de prospection manquant.');
      this.isLoading.set(false);
    }
  }

  loadProspection(id: string): void {
    this.isLoading.set(true);
    this.prospectionService.getById(id).subscribe({
      next: (data) => {
        this.prospection.set(data);
        this.isLoading.set(false);
        this.loadActions(data.id);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les détails de la prospection.');
        this.isLoading.set(false);
      },
    });
  }

  loadActions(prospectionId: string): void {
    this.actionProspectionService.getByProspectionId(prospectionId).subscribe({
      next: (list) => {
        const sorted = [...list].sort((a, b) => {
          const da = new Date(a.dateAction).getTime();
          const db = new Date(b.dateAction).getTime();
          return db - da;
        });
        this.actions.set(sorted);
      },
      error: () => this.actions.set([]),
    });
  }

  enregistrerAction(): void {
    const p = this.prospection();
    if (!p) return;
    if (this.typeActionId == null) {
      this.actionFeedback.set('Sélectionnez un type d’action.');
      return;
    }
    this.actionFeedback.set('');
    this.savingAction.set(true);
    this.actionProspectionService
      .create({
        typeActionId: this.typeActionId,
        prospectionId: p.id,
        ligneProspectionId: null,
        dateAction: new Date().toISOString(),
        commentaire: this.commentaire.trim() || null,
        resultat: this.resultat.trim() || null,
      })
      .subscribe({
        next: () => {
          this.commentaire = '';
          this.resultat = '';
          this.savingAction.set(false);
          this.loadActions(p.id);
        },
        error: () => {
          this.actionFeedback.set('Enregistrement de l’action impossible.');
          this.savingAction.set(false);
        },
      });
  }
}
