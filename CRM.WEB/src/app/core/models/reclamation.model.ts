export interface Reclamation {
  id: string; // The controller uses Guid.NewGuid()
  titre: string;
  description: string;
  statut: string;
  priorite: string;
  source: string;
  numeroReference: string;
  clientId: number;
  produitRef: number;
  responsableId?: number;
  createdAt: string;
  updatedAt: string;
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
