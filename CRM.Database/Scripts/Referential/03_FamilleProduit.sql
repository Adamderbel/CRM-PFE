INSERT INTO [comm].[FamilleProduits] (Id, libelle)
SELECT 2050, N'Etiq.adh. '
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[FamilleProduits] WHERE Id = 2050
);

INSERT INTO [comm].[FamilleProduits] (Id, libelle)
SELECT 2060, N'Etiquettes neutres'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[FamilleProduits] WHERE Id = 2060
);

INSERT INTO [comm].[FamilleProduits] (Id, libelle)
SELECT 2070, N'Etiquettes sérigraphie'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[FamilleProduits] WHERE Id = 2070
);

INSERT INTO [comm].[FamilleProduits] (Id, libelle)
SELECT 2080, N'Manchons (/1000)'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[FamilleProduits] WHERE Id = 2080
);

INSERT INTO [comm].[FamilleProduits] (Id, libelle)
SELECT 2081, N'Manchons (Kg)'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[FamilleProduits] WHERE Id = 2081
);

INSERT INTO [comm].[FamilleProduits] (Id, libelle)
SELECT 2085, N'Manchons (m²)'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[FamilleProduits] WHERE Id = 2085
);

INSERT INTO [comm].[FamilleProduits] (Id, libelle)
SELECT 2090, N'Emballage souple (kg)'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[FamilleProduits] WHERE Id = 2090
);

INSERT INTO [comm].[FamilleProduits] (Id, libelle)
SELECT 2095, N'Emballage souple (m²)'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[FamilleProduits] WHERE Id = 2095
);

INSERT INTO [comm].[FamilleProduits] (Id, libelle)
SELECT 2096, N'Capsules'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[FamilleProduits] WHERE Id = 2096
);

INSERT INTO [comm].[FamilleProduits] (Id, libelle)
SELECT 2100, N'Consommables'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[FamilleProduits] WHERE Id = 2100
);

INSERT INTO [comm].[FamilleProduits] (Id, libelle)
SELECT 2970, N'Pre-Press'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[FamilleProduits] WHERE Id = 2970
);