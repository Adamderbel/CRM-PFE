CREATE TABLE [comm].[DeploymentHistory]
(
	ScriptName NVARCHAR(200) PRIMARY KEY,
    ExecutedOn DATETIME NOT NULL DEFAULT GETDATE()
)
