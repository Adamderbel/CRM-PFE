IF NOT EXISTS (SELECT 1 FROM [sec].[Roles] WHERE Name = 'Admin')
BEGIN
    INSERT INTO [sec].[Roles](Id, Name, NormalizedName)
    VALUES (NEWID(), 'Admin', 'ADMIN')
END


IF NOT EXISTS (SELECT 1 FROM [sec].[Roles] WHERE Name = 'commercial')
BEGIN
    INSERT INTO [sec].[Roles](Id, Name, NormalizedName)
    VALUES (NEWID(), 'commercial', 'COMMERCIAL')
END
