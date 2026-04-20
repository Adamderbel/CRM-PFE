CREATE TABLE [comm].[ProduitCerm]
(
	[RefProduit] INT NOT NULL PRIMARY KEY, 
    [Designation] NVARCHAR(MAX) NULL, 
    [LastModifiedDate] DATE NULL,
    [LastSyncDate] DATE NULL
)
