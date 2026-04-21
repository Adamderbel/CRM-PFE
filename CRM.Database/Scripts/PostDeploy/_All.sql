PRINT '--- post DEPLOYMENT START ---';

-- Exemple avec script 01_Checks.sql
DECLARE @ScriptName NVARCHAR(200) = '01_test.sql';
DECLARE @ScriptNameMetaData NVARCHAR(200) = '02_SyncMetadata.sql';

IF NOT EXISTS (SELECT 1 FROM [comm].[DeploymentHistory] WHERE ScriptName = @ScriptName)
BEGIN
    PRINT 'Execution du script ' + @ScriptName;
    
    :r .\01_test.sql

    INSERT INTO [comm].[DeploymentHistory] (ScriptName, ExecutedOn)
    VALUES (@ScriptName, getDate()); 
END
ELSE
BEGIN
    PRINT 'Script ' + @ScriptName + ' déjà exécuté, skip.';
END


IF NOT EXISTS (SELECT 1 FROM [comm].[DeploymentHistory] WHERE ScriptName = @ScriptNameMetaData)
BEGIN
    PRINT 'Execution du script ' + @ScriptNameMetaData;
    
    :r .\02_SyncMetadata.sql

    INSERT INTO [comm].[DeploymentHistory] (ScriptName, ExecutedOn)
    VALUES (@ScriptNameMetaData, getDate()); 
END
ELSE
BEGIN
    PRINT 'Script ' + @ScriptNameMetaData + ' déjà exécuté, skip.';
END