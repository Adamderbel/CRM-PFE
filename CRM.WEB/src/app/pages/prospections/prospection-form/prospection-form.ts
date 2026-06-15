import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProspectionService } from '../../../core/services/prospection.service';
import { ProspectService } from '../../../core/services/prospect.service';
import { ClientCermService } from '../../../core/services/client-cerm.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProspectionCreateDto, ProspectionUpdateDto } from '../../../core/models/prospection.model';
import { Prospect } from '../../../core/models/prospect.model';

@Component({
  selector: 'app-prospection-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './prospection-form.html',
  styleUrl: './prospection-form.css',
})
export class ProspectionForm implements OnInit {
  isEditMode = signal(false);
  prospectionId = signal<string | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  prospects = signal<Prospect[]>([]);
  statuts = signal<{ id: number; libelle: string }[]>([]);
  listsLoading = signal(true);
  prospectsLoadError = signal('');

  dateDebut = signal('');
  dateFin = signal('');
  notes = signal('');
  statutId = signal('');
  prospectId = signal('');
  clientId = signal<number | null>(null);
  clientName = signal<string>('');
  userId = signal('');
  isProspectFixed = signal(false);
  isClientFixed = signal(false);

  // Initial Action fields
  typesActions = signal<{ id: number; libelle: string }[]>([]);
  typeActionId = signal<number | null>(null);
  commentaireAction = signal('');
  resultatAction = signal('');

  constructor(
    private prospectionService: ProspectionService,
    private prospectService: ProspectService,
    private clientCermService: ClientCermService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStatuts();
    this.loadTypesActions();
    // Préférer le `sub` du JWT au profil stocké (évite Guid obsolètes après reset BDD / seeder)
    const fromJwt = this.authService.getUserIdFromAccessToken();
    const fromProfile = this.authService.user()?.id;
    const connectedUserId = fromJwt ?? fromProfile;
    console.log('[ProspectionForm] Utilisateur connecté (userId)', connectedUserId, { fromJwt, fromProfile });
    if (connectedUserId) {
      this.userId.set(connectedUserId);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.prospectionId.set(id);
      this.loadProspection(id);
    } else {
      const qProspectId = this.route.snapshot.queryParamMap.get('prospectId');
      if (qProspectId) {
        this.prospectId.set(qProspectId);
        this.isProspectFixed.set(true);
      } else {
        const qClientCermId = this.route.snapshot.queryParamMap.get('clientCermId');
        if (qClientCermId) {
          const cId = Number(qClientCermId);
          this.clientId.set(cId);
          this.isClientFixed.set(true);
          this.loadClientName(cId);
        }
      }
    }
    this.loadProspects();
  }

  loadClientName(id: number): void {
    this.clientCermService.getById(id).subscribe({
      next: (client) => {
        this.clientName.set(client.nom || 'Client ' + id);
      },
      error: () => this.clientName.set('Client ' + id)
    });
  }

  loadProspects(): void {
    this.prospectsLoadError.set('');
    this.prospectService.getAll().subscribe({
      next: (data) => {
        if (this.isProspectFixed()) {
          this.prospects.set(data.filter((p) => p.id === this.prospectId()));
        } else {
          this.prospects.set(data);
        }
        this.listsLoading.set(false);
      },
      error: () => {
        if (!this.isClientFixed()) {
          this.prospectsLoadError.set(
            'Impossible de charger la liste des prospects. Vérifiez la connexion ou vos droits d’accès.'
          );
        }
        this.prospects.set([]);
        this.listsLoading.set(false);
      },
    });
  }

  loadStatuts(): void {
    this.prospectionService.getStatuts().subscribe({
      next: (data) => {
        const availableStatuts = data.filter((statut) => {
          const label = (statut.libelle || '').trim().toLowerCase().replace(/\s+/g, '');
          return label !== 'qualification';
        });

        this.statuts.set(availableStatuts);
        if (!this.isEditMode() && availableStatuts.length > 0) {
          this.statutId.set(String(availableStatuts[0].id));
        }
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les statuts de prospection.');
        this.statuts.set([]);
      },
    });
  }

  loadTypesActions(): void {
    this.prospectionService.getTypesActions().subscribe({
      next: (data) => this.typesActions.set(data),
      error: () => console.error('Erreur lors du chargement des types d\'actions')
    });
  }

  prospectLabel(p: Prospect): string {
    const n = `${p.nom ?? ''} ${p.prenom ?? ''}`.trim();
    return n || '(Sans nom)';
  }

  loadProspection(id: string): void {
    this.isLoading.set(true);
    this.prospectionService.getById(id).subscribe({
      next: (prospection) => {
        if (prospection.dateDebut) {
          const d = new Date(prospection.dateDebut);
          this.dateDebut.set(d.toISOString().slice(0, 16)); // format for datetime-local
        }
        if (prospection.dateFin) {
          const d = new Date(prospection.dateFin);
          this.dateFin.set(d.toISOString().slice(0, 16)); // format for datetime-local
        }

        this.notes.set(prospection.notes || '');
        this.statutId.set(
          prospection.statutId !== undefined && prospection.statutId !== null
            ? String(prospection.statutId)
            : ''
        );
        this.prospectId.set(prospection.prospectId ? String(prospection.prospectId) : '');
        this.clientId.set(prospection.clientId ?? null);
        if (prospection.clientId) {
          this.isClientFixed.set(true);
          this.isProspectFixed.set(false);
          this.loadClientName(prospection.clientId);
        } else if (prospection.prospectId) {
          this.isProspectFixed.set(true);
          this.isClientFixed.set(false);
        }
        this.userId.set(prospection.userId ? String(prospection.userId) : '');

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les données de la prospection.');
        this.isLoading.set(false);
      },
    });
  }

  save(): void {
    this.errorMessage.set('');

    if (!this.prospectId() && !this.clientId() && !this.isEditMode()) {
      this.errorMessage.set('Veuillez remplir Prospect ou Client.');
      return;
    }

    if (!this.statutId()) {
      this.errorMessage.set('Veuillez remplir le Statut.');
      return;
    }

    if (!this.dateDebut()) {
      this.errorMessage.set('La date de début est obligatoire.');
      return;
    }

    if (this.notes() && this.notes().length > 500) {
      this.errorMessage.set('Les notes ne peuvent pas dépasser 500 caractères.');
      return;
    }

    const isElevated =
      this.authService.hasRole('MANAGER') || this.authService.hasRole('ADMIN');
    // Création : le commercial n’envoie pas userId — le serveur utilise uniquement le JWT.
    if (isElevated && !this.userId()) {
      this.errorMessage.set('Sélectionnez le commercial assigné à la prospection.');
      return;
    }

    this.isSaving.set(true);

    const basePayload = {
      dateDebut: this.dateDebut() ? new Date(this.dateDebut()).toISOString() : undefined,
      dateFin: this.dateFin() ? new Date(this.dateFin()).toISOString() : undefined,
      notes: this.notes(),
      statutId: Number(this.statutId()),
      prospectId: this.prospectId() || undefined,
      clientId: this.clientId() || undefined,
    };

    const createPayload: ProspectionCreateDto = { 
      ...basePayload,
      typeActionId: this.typeActionId() || undefined,
      commentaireAction: this.commentaireAction() || undefined,
      resultatAction: this.resultatAction() || undefined
    };
    if (isElevated && this.userId()) {
      createPayload.userId = this.userId();
    }

    console.log('[ProspectionForm] Payload création / mise à jour', createPayload, {
      isElevated,
      edit: this.isEditMode(),
    });

    if (this.isEditMode() && this.prospectionId()) {
      const updatePayload: ProspectionUpdateDto = {
        ...basePayload,
        userId: this.userId() || undefined,
      };
      this.prospectionService.update(this.prospectionId()!, updatePayload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.successMessage.set('Prospection mise à jour avec succès.');
          this.notificationService.success('Prospection mise à jour avec succès.');
          setTimeout(() => this.router.navigate(['/prospections/detail', this.prospectionId()]), 1500);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.notificationService.error('Erreur lors de la mise à jour de la prospection.');
          console.error('[ProspectionForm] Erreur mise à jour HTTP', err.status, err.error);
          const body = err.error;
          let msg = 'Erreur lors de la mise à jour.';
          if (typeof body === 'string') msg = body;
          else if (body && typeof body === 'object') {
            msg = (body as { detail?: string }).detail
              || (body as { message?: string }).message
              || JSON.stringify(body);
          }
          this.errorMessage.set(msg);
        },
      });
    } else {
      this.prospectionService.create(createPayload).subscribe({
        next: (result) => {
          this.isSaving.set(false);
          this.successMessage.set('Prospection créée avec succès.');
          this.notificationService.success('Prospection créée avec succès.');
          setTimeout(() => this.router.navigate(['/prospections/detail', result.id]), 1500);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.notificationService.error('Erreur lors de la création de la prospection.');
          console.error('[ProspectionForm] Erreur création HTTP', err.status, err.error);
          const body = err.error;
          let msg = 'Erreur lors de la création.';
          if (typeof body === 'string') msg = body;
          else if (body && typeof body === 'object') {
            msg = (body as { detail?: string }).detail
              || (body as { message?: string }).message
              || JSON.stringify(body);
          }
          this.errorMessage.set(msg);
        },
      });
    }
  }
}
