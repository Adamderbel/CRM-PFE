PRINT '--- PRE DEPLOYMENT: DeploymentHistory ---';

-- Crée le schéma comm si nécessaire
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'comm')
BEGIN
    EXEC('CREATE SCHEMA comm');
END

-- Crée la table DeploymentHistory si elle n'existe pas
IF NOT EXISTS (SELECT 1 FROM sys.tables t
               JOIN sys.schemas s ON t.schema_id = s.schema_id
               WHERE t.name = 'DeploymentHistory' AND s.name = 'comm')
BEGIN
    CREATE TABLE [comm].[DeploymentHistory]
    (
        ScriptName NVARCHAR(200) PRIMARY KEY,
        ExecutedOn DATETIME NOT NULL DEFAULT GETDATE()
    );
END

PRINT '--- PRE DEPLOYMENT END ---';
