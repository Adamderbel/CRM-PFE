CREATE TABLE [sec].[Users]
(
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    [UserName] NVARCHAR(256) NOT NULL,
    [NormalizedUserName] NVARCHAR(256) NULL,
    [Email] NVARCHAR(256) NOT NULL,
    [NormalizedEmail] NVARCHAR(256) NOT NULL,
    [EmailConfirmed] BIT NOT NULL DEFAULT 0,
    [PasswordHash] NVARCHAR(MAX) NULL,
    [SecurityStamp] NVARCHAR(MAX) NULL,
    [ConcurrencyStamp] NVARCHAR(MAX) NULL,
    [PhoneNumber] NVARCHAR(50) NULL,
    [PhoneNumberConfirmed] BIT NOT NULL DEFAULT 0,
    [TwoFactorEnabled] BIT NOT NULL DEFAULT 0,
    [LockoutEnd] DATETIMEOFFSET NULL,
    [LockoutEnabled] BIT NOT NULL DEFAULT 1,
    [AccessFailedCount] INT NOT NULL DEFAULT 0,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(), 
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);
GO

CREATE UNIQUE INDEX [IX_Users_UserName]
ON [sec].[Users] ([NormalizedUserName]);
