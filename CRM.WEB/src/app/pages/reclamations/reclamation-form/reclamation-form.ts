import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
  imports: [FormsModule, CommonModule, RouterModule],
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
  clientDropdownOpen = signal(false);
  productDropdownOpen = signal(false);

  selectedClient = signal<ClientCerm | null>(null);
  selectedProduct = signal<ProduitCerm | null>(null);

  allClients = signal<ClientCerm[]>([]);
  allProducts = signal<ProduitCerm[]>([]);
  modeContacts = signal<ModeContact[]>([]);

  filteredClients = computed(() => {
    const query = this.normalizeSearch(this.clientSearchQuery());
    if (!query) return this.allClients();

    return this.allClients().filter((client) =>
      this.normalizeSearch(client.nom).includes(query)
      || String(client.id).includes(query)
      || this.normalizeSearch(client.codeCRM).includes(query)
    );
  });

  filteredProducts = computed(() => {
    const query = this.normalizeSearch(this.productSearchQuery());
    if (!query) return this.allProducts();

    return this.allProducts().filter((product) =>
      this.normalizeSearch(product.designation).includes(query)
      || String(product.id).includes(query)
      || this.normalizeSearch(product.codeCRM).includes(query)
    );
  });

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
      this.syncSelectedClient();
    }
  }

  loadAllClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.allClients.set(data);
        this.syncSelectedClient();
      },
      error: (err) => console.error('Erreur chargement clients', err)
    });
  }

  loadAllProducts(): void {
    this.produitService.getAll({ limit: 1000 }).subscribe({
      next: (data) => {
        this.allProducts.set(data);
        this.syncSelectedProduct();
      },
      error: (err) => {
        console.error('Erreur chargement produits', err);
        this.errorMessage.set('Impossible de charger la liste des produits.');
      }
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
        this.syncSelectedClient();
        this.syncSelectedProduct();
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

  private normalizeSearch(value: string | null | undefined): string {
    return (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  selectClient(client: ClientCerm): void {
    this.selectedClient.set(client);
    this.clientId.set(client.id);
    this.clientSearchQuery.set(client.nom || `Client ${client.id}`);
    this.clientDropdownOpen.set(false);
  }

  clearClient(): void {
    this.selectedClient.set(null);
    this.clientId.set(null);
    this.clientSearchQuery.set('');
    this.clientDropdownOpen.set(true);
  }

  onClientSearch(value: string): void {
    this.clientSearchQuery.set(value);
    if (this.selectedClient() && value !== this.selectedClient()?.nom) {
      this.selectedClient.set(null);
      this.clientId.set(null);
    }
    this.clientDropdownOpen.set(true);
  }

  selectProduct(product: ProduitCerm): void {
    this.selectedProduct.set(product);
    this.produitId.set(product.id);
    this.productSearchQuery.set(product.designation || `Produit ${product.id}`);
    this.productDropdownOpen.set(false);
  }

  clearProduct(): void {
    this.selectedProduct.set(null);
    this.produitId.set(null);
    this.productSearchQuery.set('');
    this.productDropdownOpen.set(true);
  }

  onProductSearch(value: string): void {
    this.productSearchQuery.set(value);
    if (this.selectedProduct() && value !== this.selectedProduct()?.designation) {
      this.selectedProduct.set(null);
      this.produitId.set(null);
    }
    this.productDropdownOpen.set(true);
  }

  closeClientDropdown(): void {
    setTimeout(() => this.clientDropdownOpen.set(false), 150);
  }

  closeProductDropdown(): void {
    setTimeout(() => this.productDropdownOpen.set(false), 150);
  }

  private syncSelectedClient(): void {
    const id = this.clientId();
    if (!id || this.selectedClient()) return;
    const client = this.allClients().find((item) => item.id === id);
    if (client) this.selectClient(client);
  }

  private syncSelectedProduct(): void {
    const id = this.produitId();
    if (!id || this.selectedProduct()) return;
    const product = this.allProducts().find((item) => item.id === id);
    if (product) this.selectProduct(product);
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
