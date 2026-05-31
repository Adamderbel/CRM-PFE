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
     
    [CreatedAt] DATETIME NULL, 
    [UpdatedAt] DATETIME NULL,

    [Lot] NVARCHAR(50) NULL, 
    [AnalyseReclamation] NVARCHAR(MAX) NULL, 
    [Justifiee] BIT NULL, 
    [commentaireJustification] NVARCHAR(MAX) NULL, 
    [DateExecution] DATETIME NULL, 
    [DateControleExecution] DATETIME NULL, 
    [commentaireControleExecution] NVARCHAR(MAX) NULL, 
    [DateClotureReclamation] DATETIME NULL, 
    [EtatReclamation] NVARCHAR(50) NULL, 
    [Degats] FLOAT NULL, 
    [Rapport] NVARCHAR(50) NULL, 
    [Responsable Faute] NVARCHAR(50) NULL, 
    CONSTRAINT [FK_Reclamation_ClientCerm] FOREIGN KEY ([ClientId]) REFERENCES [comm].[ClientCerm]([RefClient]),
    CONSTRAINT [FK_Reclamation_ProduitCerm] FOREIGN KEY ([ProduitRef]) REFERENCES [comm].[ProduitCerm]([RefProduit])
    
)
