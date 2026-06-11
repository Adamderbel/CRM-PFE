IF NOT EXISTS (SELECT 1 FROM [sec].[Roles] WHERE NormalizedName = 'ADMIN')
BEGIN
    INSERT INTO [sec].[Roles](Id, Name, NormalizedName)
    VALUES (NEWID(), 'Admin', 'ADMIN')
END

IF NOT EXISTS (SELECT 1 FROM [sec].[Roles] WHERE NormalizedName = 'MANAGER')
BEGIN
    INSERT INTO [sec].[Roles](Id, Name, NormalizedName)
    VALUES (NEWID(), 'manager', 'MANAGER')
END

IF NOT EXISTS (SELECT 1 FROM [sec].[Roles] WHERE NormalizedName = 'COMMERCIAL')
BEGIN
    INSERT INTO [sec].[Roles](Id, Name, NormalizedName)
    VALUES (NEWID(), 'commercial', 'COMMERCIAL')
END
