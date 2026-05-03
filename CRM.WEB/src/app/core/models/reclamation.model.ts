export interface Reclamation {
  id: string; // Guid

  titre?: string;
  description?: string;

  statut?: string;
  priorite?: string;
  source?: string;

  numeroReference?: string;

  clientId: number;
  nomClient?: string;

  produitId: number;
  designationProduit?: string;

  responsableId?: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface ReclamationCreateDto {
  titre: string;
  description: string;
  statut: string;
  priorite: string;
  source: string;
  numeroReference: string;
  clientId: number;
  produitId: number; // Note: the backend DTO uses ProduitId
  responsableId?: number;
}
