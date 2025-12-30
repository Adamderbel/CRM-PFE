CREATE TABLE [sec].[RoleClaims]
(
    [Id] INT IDENTITY(1,1) NOT NULL,
    [RoleId] UNIQUEIDENTIFIER NOT NULL,
    [ClaimType] NVARCHAR(MAX) NULL,
    [ClaimValue] NVARCHAR(MAX) NULL
);
GO
ALTER TABLE [sec].[RoleClaims]
ADD CONSTRAINT [PK_RoleClaims] PRIMARY KEY ([Id]);
GO
ALTER TABLE [sec].[RoleClaims]
ADD CONSTRAINT [FK_RoleClaims_Roles]
FOREIGN KEY ([RoleId]) REFERENCES [sec].[Roles] ([Id])
ON DELETE CASCADE;
