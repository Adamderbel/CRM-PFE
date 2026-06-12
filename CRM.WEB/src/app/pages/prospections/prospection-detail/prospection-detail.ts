import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  showActionForm = signal(false);
  deletingProspection = signal(false);
  deletingActionId = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
          this.typeActionId = null;
          this.commentaire = '';
          this.resultat = '';
          this.savingAction.set(false);
          this.showActionForm.set(false);
          this.actionFeedback.set('Action ajoutee avec succes.');
          setTimeout(() => this.actionFeedback.set(''), 5000);
          this.loadActions(p.id);
        },
        error: () => {
          this.actionFeedback.set('Enregistrement de l’action impossible.');
          this.savingAction.set(false);
        },
      });
  }

  ouvrirFormulaireAction(): void {
    this.actionFeedback.set('');
    this.showActionForm.set(true);
  }

  fermerFormulaireAction(): void {
    if (this.savingAction()) {
      return;
    }

    this.typeActionId = null;
    this.commentaire = '';
    this.resultat = '';
    this.actionFeedback.set('');
    this.showActionForm.set(false);
  }

  supprimerProspection(): void {
    const prospection = this.prospection();
    if (!prospection || !confirm('Supprimer cette prospection et toutes ses actions et lignes ?')) {
      return;
    }

    this.deletingProspection.set(true);
    this.errorMessage.set('');
    this.prospectionService.delete(prospection.id).subscribe({
      next: () => this.router.navigate(prospection.clientId ? ['/clients'] : ['/prospections']),
      error: () => {
        this.deletingProspection.set(false);
        this.errorMessage.set('Impossible de supprimer cette prospection.');
      },
    });
  }

  supprimerAction(action: ActionsProspection): void {
    if (!action.id || !confirm('Supprimer cette action commerciale ?')) {
      return;
    }

    this.deletingActionId.set(action.id);
    this.actionFeedback.set('');
    this.actionProspectionService.delete(action.id).subscribe({
      next: () => {
        this.actions.update((actions) => actions.filter((item) => item.id !== action.id));
        this.deletingActionId.set(null);
        this.actionFeedback.set('Action supprimee avec succes.');
        setTimeout(() => this.actionFeedback.set(''), 5000);
      },
      error: () => {
        this.deletingActionId.set(null);
        this.errorMessage.set('Impossible de supprimer cette action.');
      },
    });
  }
}
