CREATE TABLE [comm].[ClientCerm]
(
	[RefClient] INT NOT NULL PRIMARY KEY, 
    [Nom] NVARCHAR(MAX) NULL, 
    [LastModifiedDate ] DATE NULL,
    [LastSyncDate] DATE NULL, 
    [user_id ] UNIQUEIDENTIFIER NULL, 
  
)
