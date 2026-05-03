CREATE TABLE [crm].[ActionsProspection]
(
    Id UNIQUEIDENTIFIER PRIMARY KEY,

    ProspectionId UNIQUEIDENTIFIER NOT NULL,

    LigneProspectionId UNIQUEIDENTIFIER NULL, -- optionnel

    TypeActionId INT NOT NULL,

    DateAction DATETIME NOT NULL,

    Commentaire NVARCHAR(MAX) NULL,

    Resultat NVARCHAR(50) NULL,

    CONSTRAINT FK_Action_Prospection
        FOREIGN KEY (ProspectionId)
        REFERENCES [crm].[Prospection](Id),

    CONSTRAINT FK_Action_LigneProspection
        FOREIGN KEY (LigneProspectionId)
        REFERENCES [crm].[LigneProspections](Id),

    CONSTRAINT FK_Action_TypeAction
        FOREIGN KEY (TypeActionId)
        REFERENCES [crm].[TypeActionProspection](Id)
)