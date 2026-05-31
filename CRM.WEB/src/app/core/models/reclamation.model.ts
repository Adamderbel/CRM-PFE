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

  analyseReclamation?: string;
  justifiee?: boolean;
  commentaireJustification?: string;
  dateExecution?: string;
  dateControleExecution?: string;
  commentaireControleExecution?: string;
  dateClotureReclamation?: string;
  rapport?: string;
  responsableFaute?: string;
  degats?: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface ReclamationCreateDto {
  id?: string;
  titre: string;
  description: string;
  statut: string;
  priorite: string;
  source: string;
  numeroReference: string;
  clientId: number;
  produitId: number;
  responsableId?: number;
  analyseReclamation?: string;
  justifiee?: boolean;
  commentaireJustification?: string;
  dateExecution?: string;
  dateControleExecution?: string;
  commentaireControleExecution?: string;
  dateClotureReclamation?: string;
  rapport?: string;
  responsableFaute?: string;
  degats?: number;
}
