IF NOT EXISTS (SELECT 1 FROM [sec].[Roles] WHERE NormalizedName = 'ADMIN')
BEGIN
    INSERT INTO [sec].[Roles](Id, Name, NormalizedName)
    VALUES (NEWID(), 'ADMIN', 'ADMIN')
END

IF NOT EXISTS (SELECT 1 FROM [sec].[Roles] WHERE NormalizedName = 'MANAGER')
BEGIN
    INSERT INTO [sec].[Roles](Id, Name, NormalizedName)
    VALUES (NEWID(), 'MANAGER', 'MANAGER')
END

IF NOT EXISTS (SELECT 1 FROM [sec].[Roles] WHERE NormalizedName = 'COMMERCIAL')
BEGIN
    INSERT INTO [sec].[Roles](Id, Name, NormalizedName)
    VALUES (NEWID(), 'COMMERCIAL', 'COMMERCIAL')
END
