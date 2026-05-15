CREATE TABLE [crm].[prospect]
(
	[Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [Nom] VARCHAR(50) NULL, 
    [Prenom] VARCHAR(50) NULL, 
    [Email] VARCHAR(50) NULL, 
    [Telephone] NVARCHAR(50) NULL, 
    [Source] VARCHAR(50) NULL, 
    [DateCreation] DATETIME NULL, 
    [Notes] VARCHAR(MAX) NULL, 
    [idDomaineActivitee] INT NULL, 
    [ClientCermId ] NVARCHAR(50) NULL, 
    [CodeCRM ] NVARCHAR(50) NULL, 
    CONSTRAINT [FK_prospect_ToDomaineActivitee] FOREIGN KEY (idDomaineActivitee) REFERENCES [comm].[DomaineActivites]([id])
)
