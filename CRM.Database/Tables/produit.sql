CREATE TABLE [crm].[produit]
(
	[Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [Nom] NCHAR(10) NULL, 
    [RefArt] INT NULL, 
    [Prix] DECIMAL(10, 2) NULL, 
    [Description] NCHAR(50) NULL
	
)
