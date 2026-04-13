export interface Prospection {
  id: string;
  dateDebut?: string | Date;
  dateFin?: string | Date;
  notes?: string;
  statutId: string;
  userId?: string;
  prospectId?: string;
  statut?: any; // You can replace 'any' with the proper Statut model
  prospect?: any; // You can replace 'any' with the proper Prospect model
  user?: any; // You can replace 'any' with the proper User model
}

export interface ProspectionCreateDto {
  dateDebut?: string | Date;
  dateFin?: string | Date;
  notes?: string;
  statutId: string;
  userId?: string;
  prospectId?: string;
}

export interface ProspectionUpdateDto {
  dateDebut?: string | Date;
  dateFin?: string | Date;
  notes?: string;
  statutId: string;
  userId?: string;
  prospectId?: string;
}
