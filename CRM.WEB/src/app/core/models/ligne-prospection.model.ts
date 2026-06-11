export interface LigneProspection {
  id: string;
  designation?: string;
  dateDemandeOffre?: string | Date;
  numeroDevis?: string;
  dateDevis?: string | Date;
  numeroCommande?: string;
  dateCommande?: string | Date;
  batEnvoyee: boolean;
  dateEnvoieBat?: string | Date;
  concretisee: boolean;
  causeEchecId?: number;
  artid?: string;
  familleProduitId: number;
  supportProduitId?: number;
  prospectionId: string;
  societeId?: number;
  statutId?: number;
  date: string | Date;
  codeCRM?: string;
  // Navigation properties (optional)
  statut?: any;
  prospection?: any;
  familleProduit?: any;
  supportProduit?: any;
  societe?: any;
  causeEchec?: any;
}

export interface LigneProspectionCreateDto {
  designation?: string;
  dateDemandeOffre?: string | Date;
  numeroDevis?: string;
  dateDevis?: string | Date;
  numeroCommande?: string;
  dateCommande?: string | Date;
  batEnvoyee: boolean;
  dateEnvoieBat?: string | Date;
  concretisee: boolean;
  causeEchecId?: number;
  artid?: string;
  familleProduitId: number;
  supportProduitId?: number;
  prospectionId: string;
  societeId?: number;
  statutId?: number;
  date: string | Date;
  codeCRM?: string;
}

export interface LigneProspectionUpdateDto {
  designation?: string;
  dateDemandeOffre?: string | Date;
  numeroDevis?: string;
  dateDevis?: string | Date;
  numeroCommande?: string;
  dateCommande?: string | Date;
  batEnvoyee: boolean;
  dateEnvoieBat?: string | Date;
  concretisee: boolean;
  causeEchecId?: number;
  artid?: string;
  familleProduitId: number;
  supportProduitId?: number;
  prospectionId: string;
  societeId?: number;
  statutId?: number;
  date: string | Date;
  codeCRM?: string;
}
