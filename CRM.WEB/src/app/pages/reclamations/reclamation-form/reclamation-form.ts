import { Component, OnInit, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ClientCermService } from '../../../core/services/client-cerm.service';
import { ProduitCermService } from '../../../core/services/produit-cerm.service';
import { ModeContactService } from '../../../core/services/mode-contact.service';
import { ReclamationCreateDto } from '../../../core/models/reclamation.model';
import { ClientCerm } from '../../../core/models/client-cerm.model';
import { ProduitCerm } from '../../../core/models/produit-cerm.model';
import { ModeContact } from '../../../core/models/mode-contact.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reclamation-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reclamation-form.html',
  styleUrl: './reclamation-form.css'
})
export class ReclamationForm implements OnInit {
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  titre = signal('');
  description = signal('');
  statut = signal('Nouveau');
  priorite = signal('Normale');
  source = signal<string>('');
  numeroReference = signal('');
  clientId = signal<number | null>(null);
  produitId = signal<number | null>(null);
  responsableId = signal<string | null>(null);

  // Search
  clientSearchQuery = signal('');
  productSearchQuery = signal('');

  selectedClient = signal<ClientCerm | null>(null);
  selectedProduct = signal<ProduitCerm | null>(null);

  allClients = signal<ClientCerm[]>([]);
  allProducts = signal<ProduitCerm[]>([]);
  modeContacts = signal<ModeContact[]>([]);

  isEditMode = signal(false);
  reclamationId = signal<string | null>(null);

  constructor(
    private reclamationService: ReclamationService,
    private notificationService: NotificationService,
    private clientService: ClientCermService,
    private produitService: ProduitCermService,
    private modeContactService: ModeContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadModeContacts();
    this.loadAllClients();
    this.loadAllProducts();

    this.reclamationId.set(this.route.snapshot.paramMap.get('id'));
    if (this.reclamationId()) {
      this.isEditMode.set(true);
      this.loadReclamation(this.reclamationId()!);
    }
    
    // Check for clientId in query params (for new reclamation from client list)
    const qClientId = this.route.snapshot.queryParamMap.get('clientId');
    if (qClientId && !this.isEditMode()) {
      const id = parseInt(qClientId, 10);
      this.clientId.set(id);
    }
  }

  loadAllClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => this.allClients.set(data),
      error: (err) => console.error('Erreur chargement clients', err)
    });
  }

  loadAllProducts(): void {
    this.produitService.getAll().subscribe({
      next: (data) => this.allProducts.set(data),
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  loadReclamation(id: string): void {
    this.reclamationService.getById(id).subscribe({
      next: (res) => {
        this.titre.set(res.titre || '');
        this.description.set(res.description || '');
        this.statut.set(res.statut || 'Nouveau');
        this.priorite.set(res.priorite || 'Normale');
        this.source.set(res.source || '');
        this.numeroReference.set(res.numeroReference || '');
        this.clientId.set(res.clientId);
        this.produitId.set(res.produitId);
        this.responsableId.set(res.responsableId || null);
      },
      error: (err) => {
        this.notificationService.error('Erreur lors du chargement de la réclamation.');
        this.router.navigate(['/reclamations']);
      }
    });
  }

  loadModeContacts(): void {
    this.modeContactService.getAll().subscribe({
      next: (data) => this.modeContacts.set(data),
    });
  }

   save(): void {
     this.errorMessage.set('');

     if (!this.titre() || !this.clientId() || !this.produitId()) {
       console.warn('[ReclamationForm] Validation échouée: champs obligatoires manquants');
       this.errorMessage.set('Veuillez remplir les champs obligatoires (*).');
       return;
     }

     if (this.titre().length > 200) {
       this.errorMessage.set('Le titre ne peut pas dépasser 200 caractères.');
       return;
     }

     this.isSaving.set(true);

     const payload: any = {
       titre: this.titre(),
       description: this.description(),
       statut: this.statut(),
       priorite: this.priorite(),
       source: this.source(),
       numeroReference: this.numeroReference(),
       clientId: Number(this.clientId()),
       produitId: Number(this.produitId()),
       responsableId: this.responsableId() || undefined
     };

    if (this.isEditMode()) {
      this.reclamationService.update(this.reclamationId()!, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.notificationService.success('Réclamation mise à jour avec succès.');
          this.router.navigate(['/reclamations']);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err?.error?.error || 'Erreur lors de la mise à jour.');
        }
      });
    } else {
      this.reclamationService.create(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.notificationService.success('Réclamation créée avec succès.');
          this.router.navigate(['/reclamations']);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err?.error?.error || 'Erreur lors de la création.');
        }
      });
    }
  }
}
