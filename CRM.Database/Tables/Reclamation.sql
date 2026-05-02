CREATE TABLE [crm].[Reclamation]
(
	[Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [Titre] NVARCHAR(200) NULL, 
    [Description] NVARCHAR(max) NULL, 
    [Statut] NVARCHAR(50) NULL, 
    [Priorite] NVARCHAR(50) NULL, 
    [Source] NVARCHAR(50) NULL, 
    [NumeroReference] NVARCHAR(100) NULL, 
    [ClientId] INT NULL, 
    [ProduitRef] INT NULL, 
    [ResponsableId] INT NULL, 
     
    [CreatedAt] DATETIME NULL, 
    [UpdatedAt] DATETIME NULL,

    CONSTRAINT [FK_Reclamation_ClientCerm] FOREIGN KEY ([ClientId]) REFERENCES [comm].[ClientCerm]([RefClient]),
    CONSTRAINT [FK_Reclamation_ProduitCerm] FOREIGN KEY ([ProduitRef]) REFERENCES [comm].[ProduitCerm]([RefProduit])
    
)
