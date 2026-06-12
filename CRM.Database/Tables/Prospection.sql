CREATE TABLE [Crm].[Prospection]
(
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [DateDebut] DATETIME NULL, 
    [DateFin] DATETIME NULL, 
    [Notes] NVARCHAR(50) NULL,
    StatutId INT NULL,
    UserId UNIQUEIDENTIFIER NULL,
    prospectId UNIQUEIDENTIFIER NULL,
    ClientId INT NULL,
    
    Constraint [FK_Prospection_ToProspect] FOREIGN KEY (prospectId) REFERENCES [crm].[Prospect]([Id]),
    Constraint [FK_Prospection_ToClientCerm] FOREIGN KEY (ClientId) REFERENCES [comm].[ClientCerm]([RefClient]),

    Constraint [FK_Prospection_ToStatut] FOREIGN KEY (StatutId) REFERENCES [crm].[StatutProspection]([Id]),
    CONSTRAINT [FK_Prospection_ToUser]  FOREIGN KEY (UserId)  REFERENCES [sec].[Users]([Id])    
)
