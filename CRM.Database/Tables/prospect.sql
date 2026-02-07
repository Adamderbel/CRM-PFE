CREATE TABLE [crm].[prospect]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [Nom] VARCHAR(50) NULL, 
    [Prenom] VARCHAR(50) NULL, 
    [Email] VARCHAR(50) NULL, 
    [Telephone] NVARCHAR(50) NULL, 
    [Source] VARCHAR(50) NULL, 
    [DateCreation] DATETIME NULL, 
    [Notes] VARCHAR(MAX) NULL
)
