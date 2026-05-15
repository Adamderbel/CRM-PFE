CREATE TABLE comm.CERM_commande (
     ref_commande VARCHAR(50) NOT NULL PRIMARY KEY,
    reference_commande VARCHAR(50) NULL,

    client_id VARCHAR(50) NULL,
    site_id VARCHAR(50) NULL,

    date_commande DATETIME NULL,
    date_livraison_prevue DATETIME NULL,
    date_livraison_reelle DATETIME NULL,

    statut_commande VARCHAR(50) NULL
);