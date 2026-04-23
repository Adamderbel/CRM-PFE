CREATE PROCEDURE [comm].[sp_RechercherProduitCerm]
    @Recherche NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Détection dynamique : entier → recherche par RefProduit, texte → par Designation
    IF TRY_CONVERT(INT, @Recherche) IS NOT NULL
    BEGIN
        -- Recherche par référence (correspondance exacte)
        SELECT 
            RefProduit,
            Designation,
            LastModifiedDate,
            LastSyncDate
        FROM [comm].[ProduitCerm]
        WHERE RefProduit = CONVERT(INT, @Recherche);
    END
    ELSE
    BEGIN
        -- Recherche par désignation (correspondance partielle, insensible à la casse)
        SELECT 
            RefProduit,
            Designation,
            LastModifiedDate,
            LastSyncDate
        FROM [comm].[ProduitCerm]
        WHERE Designation LIKE N'%' + @Recherche + N'%';
    END
END;
GO