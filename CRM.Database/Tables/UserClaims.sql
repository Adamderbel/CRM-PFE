CREATE TABLE [sec].[UserClaims]
(
    [Id] INT IDENTITY(1,1) NOT NULL,
    [UserId] UNIQUEIDENTIFIER NOT NULL,
    [ClaimType] NVARCHAR(MAX) NULL,
    [ClaimValue] NVARCHAR(MAX) NULL
);
GO
ALTER TABLE [sec].[UserClaims]
ADD CONSTRAINT [PK_UserClaims] PRIMARY KEY ([Id]);
GO
ALTER TABLE [sec].[UserClaims]
ADD CONSTRAINT [FK_UserClaims_Users]
FOREIGN KEY ([UserId]) REFERENCES [sec].[Users] ([Id])
ON DELETE CASCADE;
