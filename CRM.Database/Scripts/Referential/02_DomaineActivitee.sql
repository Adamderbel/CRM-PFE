INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 1, N'A déterminer'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 1
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 2, N'Autres secteurs'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 2
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 4, N'Agroalimentaire'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 4
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 5, N'Cosmétique'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 5
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 6, N'Chaussures'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 6
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 7, N'Hyper-distribution'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 7
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 8, N'Informatique/Bureauti'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 8
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 9, N'Plastiques'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 9
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 10, N'Imprimerie'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 10
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 11, N'Informatique'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 11
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 12, N'Textile'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 12
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 13, N'Petrolier'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 13
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 15, N'AUTOMOBILE'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 15
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 16, N'BUREAUTIQUE'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 16
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 17, N'CHIMIQUE'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 17
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 19, N'HABILLEMENT'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 19
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 21, N'PHARMA'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 21
);

INSERT INTO [comm].[DomaineActivites] (Id, activitee)
SELECT 22, N'REVENDEUR'
WHERE NOT EXISTS (
    SELECT 1 FROM [comm].[DomaineActivites] WHERE Id = 22
);

