export interface LigneProspection {
  id: string;
  designation?: string;
  dateDemandeOffre?: string | Date;
  numeroDevis?: string;
  dateDevis?: string | Date;
  numeroCommande?: string;
  dateCommande?: string | Date;
  batEnvoyee: boolean;
  dateEnvoiBat?: string | Date;
  concretisee: boolean;
  causeEchecId?: number;
  refArt?: string;
  familleProduitId: number;
  supportProduitId?: number;
  prospectionId: string;
  societeId?: number;
  societeeId?: number;
  statutId?: number;
  date: string | Date;
  codeCRM?: string;
  // Navigation properties (optional)
  statut?: any;
  prospection?: any;
  familleProduit?: any;
  supportProduit?: any;
  societe?: any;
  societee?: any;
  causeEchec?: any;
}

export interface DevisRequestDto {
  date: string;
  email: string;
  notes: string;
}

export interface LigneProspectionCreateDto {
  designation?: string;
  familleProduitId: number;
  supportProduitId?: number;
  prospectionId: string;
  societeId?: number;
  statutId?: number;
  date: string | Date;
}

export interface LigneProspectionUpdateDto {
  designation?: string;
  dateDemandeOffre?: string | Date;
  numeroDevis?: string;
  dateDevis?: string | Date;
  numeroCommande?: string;
  dateCommande?: string | Date;
  batEnvoyee: boolean;
  dateEnvoiBat?: string | Date;
  concretisee: boolean;
  causeEchecId?: number;
  familleProduitId: number;
  supportProduitId?: number;
  prospectionId: string;
  societeId?: number;
  statutId?: number;
  date: string | Date;
}
