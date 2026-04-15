INSERT INTO [crm].[StatutProspection] (Id, libelle)
SELECT 1, N'Nouveau'
WHERE NOT EXISTS (SELECT 1 FROM [crm].[StatutProspection] WHERE Id = 1);

INSERT INTO [crm].[StatutProspection] (Id, libelle)
SELECT 2, N'Qualification'
WHERE NOT EXISTS (SELECT 1 FROM [crm].[StatutProspection] WHERE Id = 2);

INSERT INTO [crm].[StatutProspection] (Id, libelle)
SELECT 3, N'Proposition'
WHERE NOT EXISTS (SELECT 1 FROM [crm].[StatutProspection] WHERE Id = 3);

INSERT INTO [crm].[StatutProspection] (Id, libelle)
SELECT 4, N'Négociation'
WHERE NOT EXISTS (SELECT 1 FROM [crm].[StatutProspection] WHERE Id = 4);

INSERT INTO [crm].[StatutProspection] (Id, libelle)
SELECT 5, N'Gagné'
WHERE NOT EXISTS (SELECT 1 FROM [crm].[StatutProspection] WHERE Id = 5);

INSERT INTO [crm].[StatutProspection] (Id, libelle)
SELECT 6, N'Perdu'
WHERE NOT EXISTS (SELECT 1 FROM [crm].[StatutProspection] WHERE Id = 6);