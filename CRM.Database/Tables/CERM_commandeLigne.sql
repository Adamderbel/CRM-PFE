CREATE TABLE [comm].[CERM_commandeLigne]
(
	ref_commande VARCHAR(50) NOT NULL,
    ligne_id VARCHAR(50) NOT NULL,

    produit_id VARCHAR(50) NULL,
    client_id VARCHAR(50) NULL,

    qte_commandee DECIMAL(18, 3) NULL,
    qte_expediee DECIMAL(18,3) NULL,

    statut_ligne VARCHAR(20) NULL,

    date_commande DATETIME NULL,
    date_livraison_prevue DATETIME NULL,
    date_livraison_reelle DATETIME NULL,

    CONSTRAINT PK_CERM_commandeLigne
        PRIMARY KEY (ref_commande, ligne_id)
);