export interface Commande {
  refCommande: string;
  referenceCommande?: string;
  clientId?: string;
  siteId?: string;
  dateCommande?: string;
  dateLivraisonPrevue?: string;
  dateLivraisonReelle?: string;
  statutCommande?: string;
}

export interface CommandeLigne {
  ligneId: string;
  refCommande: string;
  produitId: string;
  clientId: string;
  qteCommandee?: number;
  qteExpediee?: number;
  statutLigne?: string;
  dateCommande?: string;
  dateLivraisonPrevue?: string;
  dateLivraisonReelle?: string;
}

export interface CommandeDetailDto {
  commande: Commande;
  lignes: CommandeLigne[];
}
