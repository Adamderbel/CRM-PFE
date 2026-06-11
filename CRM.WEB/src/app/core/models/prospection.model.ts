export interface Prospection {
  id: string;
  dateDebut: string;
  dateFin?: string;
  notes?: string;
  statutId?: number;
  userId?: string;
  prospectId?: string;
  clientId?: number;
  statut?: { id: number; libelle: string };
  user?: { id: string; nom: string; prenom: string };
  prospect?: { id: string; nom: string; prenom: string };
  client?: { id: number; nom: string };
}

export interface ProspectionCreateDto {
  dateDebut?: string | Date;
  dateFin?: string | Date;
  notes?: string;
  statutId: number;
  userId?: string;
  prospectId?: string;
  clientId?: number;
  typeActionId?: number;
  commentaireAction?: string;
  resultatAction?: string;
}

export interface ProspectionUpdateDto {
  dateDebut?: string | Date;
  dateFin?: string | Date;
  notes?: string;
  statutId: number;
  userId?: string;
  prospectId?: string;
  clientId?: number;
}
