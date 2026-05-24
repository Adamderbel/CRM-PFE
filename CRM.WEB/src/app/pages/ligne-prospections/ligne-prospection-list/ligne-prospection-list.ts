import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LigneProspectionService } from '../../../core/services/ligne-prospection.service';
import { TypeActionProspectionService } from '../../../core/services/type-action-prospection.service';
import { ActionProspectionService } from '../../../core/services/action-prospection.service';
import { CauseEchecService, CauseEchec } from '../../../core/services/cause-echec.service';
import { LigneProspection } from '../../../core/models/ligne-prospection.model';
import { TypeActionProspection } from '../../../core/models/type-action-prospection.model';
import { ActionProspection } from '../../../core/models/action-prospection.model';

@Component({
  selector: 'app-ligne-prospection-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ligne-prospection-list.html',
  styleUrl: './ligne-prospection-list.css'
})
export class LigneProspectionList implements OnInit {
  isTypeActionModalOpen = signal(false);
  isLoadingTypeActions = signal(false);
  typeActions = signal<TypeActionProspection[]>([]);
  selectedLigne = signal<LigneProspection | null>(null);
  selectedTypeActionId = signal<number | null>(null);
  commentaire = signal('');
  actionErrorMessage = signal('');
  isSavingAction = signal(false);

  isActionsListModalOpen = signal(false);
  ligneActions = signal<ActionProspection[]>([]);
  isLoadingLigneActions = signal(false);
  actionsListError = signal('');
  ligneForActionsList = signal<LigneProspection | null>(null);

  isDevisModalOpen = signal<boolean>(false);
  devisData = signal<{ notes: string; email: string; date: string; ligne: any }>({
    notes: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    ligne: null
  });

  isCloseModalOpen = signal<boolean>(false);
  ligneToClose = signal<LigneProspection | null>(null);
  closeModalData = signal<{ ligne: LigneProspection | null }>({ ligne: null });
  selectedCauseEchecId = signal<number | null>(null);
  causeEchecs = signal<CauseEchec[]>([]);
  isClosingLigne = signal<boolean>(false);
  closeModalError = signal<string>('');

  isStatusChangeModalOpen = signal<boolean>(false);
  statusChangeData = signal<{ ligne: LigneProspection | null }>({ ligne: null });
  selectedStatutId = signal<number | null>(null);
  statuts = signal<any[]>([]);
  isChangingStatus = signal<boolean>(false);
  statusChangeError = signal<string>('');

  prospectionId = signal<string | null>(null);
  searchQuery = signal('');

  filteredLignes = computed(() => {
    let list = this.ligneProspectionService.ligneProspections();

    // Filter by prospectionId if one is selected
    if (this.prospectionId()) {
      list = list.filter(lp => lp.prospectionId === this.prospectionId());
    }

    const q = this.searchQuery().toLowerCase();
    if (q) {
      list = list.filter(lp =>
        lp.designation?.toLowerCase().includes(q) ||
        lp.statut?.libelle?.toLowerCase().includes(q)
      );
    }

    return list;
  });

  availableStatuts = computed(() => {
    return this.statuts().filter(s =>
      ['Qualification', 'Proposition', 'Négociation'].includes(s.libelle || '')
    );
  });

  constructor(
    public ligneProspectionService: LigneProspectionService,
    private typeActionService: TypeActionProspectionService,
    private actionProspectionService: ActionProspectionService,
    private causeEchecService: CauseEchecService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if a specific prospection ID was passed
    this.route.paramMap.subscribe(params => {
      const pid = params.get('prospectionId');
      if (pid) {
        this.prospectionId.set(pid);
      }
      this.ligneProspectionService.getAll().subscribe();
    });
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  isOffreDemandee(ligne: LigneProspection): boolean {
    return !!ligne.dateDemandeOffre;
  }

  isDevisOk(ligne: LigneProspection): boolean {
    return !!ligne.numeroDevis?.trim();
  }

  isCommandeOk(ligne: LigneProspection): boolean {
    return !!ligne.numeroCommande?.trim();
  }

  isStatusFinal(ligne: LigneProspection): boolean {
    const libelle = ligne.statut?.libelle?.toLowerCase() || '';
    return libelle === 'gagné' || libelle === 'perdu';
  }

  formatDateTime(date: string | Date | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  openActionsListModal(ligne: LigneProspection): void {
    this.ligneForActionsList.set(ligne);
    this.ligneActions.set([]);
    this.actionsListError.set('');
    this.isActionsListModalOpen.set(true);
    this.loadLigneActions(ligne.id);
  }

  closeActionsListModal(): void {
    this.isActionsListModalOpen.set(false);
    this.ligneForActionsList.set(null);
    this.ligneActions.set([]);
    this.actionsListError.set('');
  }

  private loadLigneActions(ligneId: string): void {
    this.isLoadingLigneActions.set(true);
    this.actionProspectionService.getByLigneProspectionId(ligneId).subscribe({
      next: (actions) => {
        this.ligneActions.set(actions);
        this.isLoadingLigneActions.set(false);
      },
      error: (err) => {
        this.isLoadingLigneActions.set(false);
        const body = err?.error;
        const msg = typeof body === 'string'
          ? body
          : body?.details || body?.message || 'Impossible de charger les actions.';
        this.actionsListError.set(msg);
      }
    });
  }

  openTypeActionModal(ligne: LigneProspection): void {
    this.selectedLigne.set(ligne);
    this.selectedTypeActionId.set(null);
    this.commentaire.set('');
    this.actionErrorMessage.set('');
    this.isTypeActionModalOpen.set(true);

    if (this.typeActions().length > 0) {
      return;
    }

    this.loadTypeActions();
  }

  private loadTypeActions(): void {
    this.isLoadingTypeActions.set(true);
    this.typeActionService.getAll().subscribe({
      next: (types) => {
        this.typeActions.set(types);
        this.isLoadingTypeActions.set(false);
      },
      error: () => {
        this.isLoadingTypeActions.set(false);
        this.actionErrorMessage.set('Impossible de charger les types d\'action.');
      }
    });
  }

  closeTypeActionModal(): void {
    this.isTypeActionModalOpen.set(false);
    this.selectedLigne.set(null);
    this.selectedTypeActionId.set(null);
    this.commentaire.set('');
    this.actionErrorMessage.set('');
  }

  onTypeActionChange(value: string): void {
    this.selectedTypeActionId.set(value ? Number(value) : null);
    this.actionErrorMessage.set('');
  }

  submitAction(): void {
    const ligne = this.selectedLigne();
    const typeActionId = this.selectedTypeActionId();

    if (!ligne) return;

    if (!typeActionId) {
      this.actionErrorMessage.set('Veuillez sélectionner un type d\'action.');
      return;
    }

    this.isSavingAction.set(true);
    this.actionErrorMessage.set('');

    this.actionProspectionService.create({
      prospectionId: ligne.prospectionId,
      ligneProspectionId: ligne.id,
      typeActionId,
      dateAction: new Date().toISOString(),
      commentaire: this.commentaire().trim() || undefined
    }).subscribe({
      next: () => {
        this.isSavingAction.set(false);
        const libelle = this.typeActions().find(t => t.id === typeActionId)?.libelle ?? '';
        alert(libelle ? `Action « ${libelle} » enregistrée avec succès.` : 'Action enregistrée avec succès.');
        this.closeTypeActionModal();
      },
      error: (err) => {
        this.isSavingAction.set(false);
        const body = err?.error;
        const msg = typeof body === 'string'
          ? body
          : body?.details || body?.innerDetails || body?.error || body?.message || err?.message || 'Erreur lors de l\'enregistrement de l\'action.';
        this.actionErrorMessage.set(msg);
      }
    });
  }

  openDevisModal(ligne: any): void {
    this.devisData.set({
      notes: '',
      email: '',
      date: new Date().toISOString().split('T')[0], // current date auto
      ligne: ligne
    });
    this.isDevisModalOpen.set(true);
  }

  closeDevisModal(): void {
    this.isDevisModalOpen.set(false);
  }

  submitDevis(): void {
    const data = this.devisData();
    if (!data.ligne) return;

    console.log('Sending Devis request with data:', data);

    // Call the service to send the quote request
    this.ligneProspectionService.demanderDevis(data.ligne.id, {
      date: data.date,
      email: data.email,
      notes: data.notes
    }).subscribe({
      next: (res) => {
        console.log('Devis demandé avec succès', res);
        alert('Demande de devis envoyée avec succès !');
        this.closeDevisModal();
      },
      error: (err) => {
        console.error('Erreur', err);
        alert('Erreur lors de l\'envoi de la demande de devis.');
        // close modal anyway or let the user try again
      }
    });
  }

  openCloseModal(ligne: LigneProspection): void {
    this.ligneToClose.set(ligne);
    this.closeModalData.set({ ligne });
    this.selectedCauseEchecId.set(null);
    this.closeModalError.set('');
    this.isCloseModalOpen.set(true);

    if (!ligne.concretisee) {
      this.loadCauseEchecs();
    }
  }

  closeCloseModal(): void {
    this.isCloseModalOpen.set(false);
    this.ligneToClose.set(null);
    this.closeModalData.set({ ligne: null });
    this.selectedCauseEchecId.set(null);
    this.closeModalError.set('');
  }

  onCauseEchecChange(value: string): void {
    this.selectedCauseEchecId.set(value ? Number(value) : null);
    this.closeModalError.set('');
  }

  private loadCauseEchecs(): void {
    if (this.causeEchecs().length > 0) {
      return;
    }

    this.causeEchecService.getAll().subscribe({
      next: (causes) => {
        this.causeEchecs.set(causes);
      },
      error: () => {
        this.closeModalError.set('Impossible de charger les causes d\'échec.');
      }
    });
  }

  submitClose(): void {
    const ligne = this.ligneToClose();
    if (!ligne) return;

    if (!ligne.concretisee && !this.selectedCauseEchecId()) {
      this.closeModalError.set('Veuillez sélectionner une cause d\'échec.');
      return;
    }

    this.isClosingLigne.set(true);
    this.closeModalError.set('');

    this.ligneProspectionService.close(ligne.id, this.selectedCauseEchecId() || undefined).subscribe({
      next: () => {
        this.isClosingLigne.set(false);
        alert('Ligne de prospection clôturée avec succès.');
        this.closeCloseModal();
      },
      error: (err) => {
        this.isClosingLigne.set(false);
        const body = err?.error;
        const msg = typeof body === 'string'
          ? body
          : body?.details || body?.message || 'Erreur lors de la clôture de la ligne.';
        this.closeModalError.set(msg);
      }
    });
  }

  openStatusChangeModal(ligne: LigneProspection): void {
    this.statusChangeData.set({ ligne });
    this.selectedStatutId.set(null);
    this.statusChangeError.set('');
    this.isStatusChangeModalOpen.set(true);

    if (this.statuts().length === 0) {
      this.loadStatuts();
    }
  }

  closeStatusChangeModal(): void {
    this.isStatusChangeModalOpen.set(false);
    this.statusChangeData.set({ ligne: null });
    this.selectedStatutId.set(null);
    this.statusChangeError.set('');
  }

  private loadStatuts(): void {
    this.ligneProspectionService.getStatuts().subscribe({
      next: (statuts) => {
        this.statuts.set(statuts);
      },
      error: () => {
        this.statusChangeError.set('Impossible de charger les statuts.');
      }
    });
  }

  onStatutChange(value: string): void {
    this.selectedStatutId.set(value ? Number(value) : null);
    this.statusChangeError.set('');
  }

  submitStatusChange(): void {
    const ligne = this.statusChangeData().ligne;
    const statutId = this.selectedStatutId();

    if (!ligne || !statutId) return;

    this.isChangingStatus.set(true);
    this.statusChangeError.set('');

    this.ligneProspectionService.update(ligne.id, {
      designation: ligne.designation,
      familleProduitId: ligne.familleProduitId,
      supportProduitId: ligne.supportProduitId,
      prospectionId: ligne.prospectionId,
      societeeId: ligne.societeeId,
      statutId: statutId,
      date: ligne.date
    }).subscribe({
      next: () => {
        this.isChangingStatus.set(false);
        alert('Statut modifié avec succès.');
        this.closeStatusChangeModal();
      },
      error: (err) => {
        this.isChangingStatus.set(false);
        const body = err?.error;
        const msg = typeof body === 'string'
          ? body
          : body?.details || body?.message || 'Erreur lors de la modification du statut.';
        this.statusChangeError.set(msg);
      }
    });
  }
}
