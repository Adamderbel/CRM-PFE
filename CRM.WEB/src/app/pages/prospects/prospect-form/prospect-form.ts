import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProspectService } from '../../../core/services/prospect.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ClientCermService } from '../../../core/services/client-cerm.service';
import { CreateProspectRequest, DomaineActivite, UpdateProspectRequest } from '../../../core/models/prospect.model';
import { ModeContact } from '../../../core/models/mode-contact.model';
import { ClientCerm } from '../../../core/models/client-cerm.model';

@Component({
  selector: 'app-prospect-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './prospect-form.html',
  styleUrl: './prospect-form.css',
})
export class ProspectForm implements OnInit {
  isEditMode = signal(false);
  prospectId = signal<string | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
   domaines = signal<DomaineActivite[]>([]);
   modeContacts = signal<ModeContact[]>([]);
   clientsCerm = signal<ClientCerm[]>([]);

  nom = signal('');
  prenom = signal('');
  email = signal('');
  telephone = signal('');
  source = signal<string>('');
  notes = signal('');
  idDomaineActivite = signal<number>(0);
  clientCermId = signal<number | null>(null);
  codeCRM = signal('');

  constructor(
    private prospectService: ProspectService,
    private notificationService: NotificationService,
    private clientCermService: ClientCermService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDomaines();
    this.loadModeContacts();
    this.loadClientsCerm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.prospectId.set(id);
      this.loadProspect(id);
    } else {
      this.loadNextCode();
      const qClientCermId = this.route.snapshot.queryParamMap.get('clientCermId');
      if (qClientCermId) {
        const cId = parseInt(qClientCermId, 10);
        this.clientCermId.set(cId);
        this.clientCermService.getById(cId).subscribe({
          next: (client) => {
            if (client.nom) {
              this.nom.set(client.nom);
            }
          }
        });
      }
    }
  }

  loadNextCode(): void {
    this.prospectService.getNextCode().subscribe({
      next: (res) => this.codeCRM.set(res.code),
      error: (err) => console.error('Erreur lors du chargement du code CRM', err)
    });
  }

  loadDomaines(): void {
    this.prospectService.getDomainesActivite().subscribe({
      next: (data) => this.domaines.set(data),
    });
  }

  loadModeContacts(): void {
    this.prospectService.getModeContacts().subscribe({
      next: (data) => this.modeContacts.set(data),
    });
  }

  loadClientsCerm(): void {
    this.clientCermService.getAll().subscribe({
      next: (data) => this.clientsCerm.set(data),
    });
  }

  loadProspect(id: string): void {
    console.log('[ProspectForm] Chargement des données du prospect:', id);
    this.isLoading.set(true);
    this.prospectService.getById(id).subscribe({
      next: (prospect) => {
        console.log('[ProspectForm] Données chargées avec succès:', prospect);
        this.nom.set(prospect.nom || '');
        this.prenom.set(prospect.prenom || '');
        this.email.set(prospect.email || '');
        this.telephone.set(prospect.telephone || '');
        this.source.set(prospect.source || '');
        this.notes.set(prospect.notes || '');
        this.idDomaineActivite.set(prospect.idDomaineActivite);
        this.clientCermId.set(prospect.clientCermId || null);
        this.codeCRM.set(prospect.codeCRM || '');
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[ProspectForm] Erreur lors du chargement du prospect:', err);
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de charger le prospect.');
      },
    });
  }

  onSubmit(): void {
    this.errorMessage.set('');

    if (!this.nom() || !this.prenom() || !this.email() || !this.telephone() || !this.idDomaineActivite()) {
      console.warn('[ProspectForm] Validation échouée: champs obligatoires manquants');
      this.errorMessage.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (this.nom().length > 100) {
      this.errorMessage.set('Le nom ne peut pas dépasser 100 caractères.');
      return;
    }

    if (this.prenom().length > 100) {
      this.errorMessage.set('Le prénom ne peut pas dépasser 100 caractères.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.errorMessage.set('Format d\'email invalide. Exemple: nom@domaine.com');
      return;
    }
    if (this.email().length > 150) {
      this.errorMessage.set('L\'email ne peut pas dépasser 150 caractères.');
      return;
    }

    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    if (!phoneRegex.test(this.telephone())) {
      this.errorMessage.set('Format de téléphone invalide. Exemple: 22 777 888');
      return;
    }
    if (this.telephone().length > 20) {
      this.errorMessage.set('Le téléphone ne peut pas dépasser 20 caractères.');
      return;
    }

    if (this.notes() && this.notes().length > 500) {
      this.errorMessage.set('Les notes ne peuvent pas dépasser 500 caractères.');
      return;
    }

    this.isSaving.set(true);

    if (this.isEditMode()) {
      const dto: UpdateProspectRequest = {
        nom: this.nom(),
        prenom: this.prenom(),
        email: this.email(),
        telephone: this.telephone(),
        source: this.source() || undefined,
        notes: this.notes(),
        idDomaineActivite: this.idDomaineActivite(),
        clientCermId: this.clientCermId() || undefined,
        codeCRM: this.codeCRM() || undefined,
      };

      console.log('[ProspectForm] Envoi de la mise à jour:', dto);
      this.prospectService.update(this.prospectId()!, dto).subscribe({
        next: (res) => {
          console.log('[ProspectForm] Mise à jour réussie:', res);
          this.isSaving.set(false);
          this.notificationService.success('Prospect mis à jour avec succès.');
          this.router.navigate(['/prospects']);
        },
        error: (err) => {
          console.error('[ProspectForm] Erreur lors de la mise à jour:', err);
          this.isSaving.set(false);
          this.notificationService.error('Erreur lors de la mise à jour du prospect.');
          this.errorMessage.set(err?.error || 'Erreur lors de la mise à jour.');
        },
      });
    } else {
      const request: CreateProspectRequest = {
        nom: this.nom(),
        prenom: this.prenom(),
        email: this.email(),
        telephone: this.telephone(),
        source: this.source() || undefined,
        notes: this.notes(),
        idDomaineActivite: this.idDomaineActivite(),
        clientCermId: this.clientCermId() || undefined,
        codeCRM: this.codeCRM() || undefined,
      };

      console.log('[ProspectForm] Envoi de la création:', request);
      this.prospectService.create(request).subscribe({
        next: (res) => {
          console.log('[ProspectForm] Création réussie:', res);
          this.isSaving.set(false);
          this.notificationService.success('Prospect créé avec succès.');
          this.router.navigate(['/prospects']);
        },
        error: (err) => {
          console.error('[ProspectForm] Erreur lors de la création:', err);
          this.isSaving.set(false);
          this.notificationService.error('Erreur lors de la création du prospect.');
          this.errorMessage.set(err?.error || 'Erreur lors de la création.');
        },
      });
    }
  }
}
