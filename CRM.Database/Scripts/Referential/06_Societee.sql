INSERT INTO [comm].[Societees] (Id, Nom)
SELECT 1, N'Alpha Etiquettes'
WHERE NOT EXISTS (SELECT 1 FROM [comm].[Societees] WHERE Id = 1);

INSERT INTO [comm].[Societees] (Id, Nom)
SELECT 2, N'2MPACK'
WHERE NOT EXISTS (SELECT 1 FROM [comm].[Societees] WHERE Id = 2);

INSERT INTO [comm].[Societees] (Id, Nom)
SELECT 3, N'Alpha Negoce'
WHERE NOT EXISTS (SELECT 1 FROM [comm].[Societees] WHERE Id = 3);