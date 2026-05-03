IF NOT EXISTS (SELECT 1 FROM [crm].[TypeActionProspection] WHERE Libelle = 'Appel téléphonique')
INSERT INTO [crm].[TypeActionProspection] VALUES ('Appel téléphonique');

IF NOT EXISTS (SELECT 1 FROM [crm].[TypeActionProspection] WHERE Libelle = 'Relance téléphonique')
INSERT INTO [crm].[TypeActionProspection] VALUES ('Relance téléphonique');

IF NOT EXISTS (SELECT 1 FROM [crm].[TypeActionProspection] WHERE Libelle = 'Email initial')
INSERT INTO [crm].[TypeActionProspection] VALUES ('Email initial');

IF NOT EXISTS (SELECT 1 FROM [crm].[TypeActionProspection] WHERE Libelle = 'Relance email')
INSERT INTO [crm].[TypeActionProspection] VALUES ('Relance email');

IF NOT EXISTS (SELECT 1 FROM [crm].[TypeActionProspection] WHERE Libelle = 'Envoi devis')
INSERT INTO [crm].[TypeActionProspection] VALUES ('Envoi devis');

IF NOT EXISTS (SELECT 1 FROM [crm].[TypeActionProspection] WHERE Libelle = 'Rendez-vous client')
INSERT INTO [crm].[TypeActionProspection] VALUES ('Rendez-vous client');

IF NOT EXISTS (SELECT 1 FROM [crm].[TypeActionProspection] WHERE Libelle = 'Démo produit')
INSERT INTO [crm].[TypeActionProspection] VALUES ('Démo produit');

IF NOT EXISTS (SELECT 1 FROM [crm].[TypeActionProspection] WHERE Libelle = 'Qualification du besoin')
INSERT INTO [crm].[TypeActionProspection] VALUES ('Qualification du besoin');

IF NOT EXISTS (SELECT 1 FROM [crm].[TypeActionProspection] WHERE Libelle = 'Analyse concurrence')
INSERT INTO [crm].[TypeActionProspection] VALUES ('Analyse concurrence');

IF NOT EXISTS (SELECT 1 FROM [crm].[TypeActionProspection] WHERE Libelle = 'Négociation')
INSERT INTO [crm].[TypeActionProspection] VALUES ('Négociation');

IF NOT EXISTS (SELECT 1 FROM [crm].[TypeActionProspection] WHERE Libelle = 'Suivi commande')
INSERT INTO [crm].[TypeActionProspection] VALUES ('Suivi commande');

IF NOT EXISTS (SELECT 1 FROM [crm].[TypeActionProspection] WHERE Libelle = 'Autre')
INSERT INTO [crm].[TypeActionProspection] VALUES ('Autre');