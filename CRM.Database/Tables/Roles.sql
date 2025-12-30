CREATE TABLE [sec].[Roles]
(
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    [Name] NVARCHAR(256) NOT NULL,
    [NormalizedName] NVARCHAR(256) NOT NULL,
    [ConcurrencyStamp] NVARCHAR(MAX) NULL
);
GO
ALTER TABLE [sec].[Roles]
ADD CONSTRAINT [PK_Roles] PRIMARY KEY ([Id]);
GO
CREATE UNIQUE INDEX [IX_Roles_NormalizedName]
ON [sec].[Roles] ([NormalizedName]);
