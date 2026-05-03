INSERT INTO [comm].[CauseEchecs] (Libelle)
SELECT v.Libelle
FROM (VALUES
('Prix trop élevé'),
('Budget insuffisant'),
('Pas de besoin'),
('Projet annulé'),
('Concurrent choisi'),
('Produit non adapté'),
('Délais trop longs'),
('Client injoignable'),
('Mauvais timing'),
('Décideur non atteint'),
('Manque de suivi commercial'),
('Mauvaise qualification du besoin'),
('Offre concurrente plus attractive'),
('Problème technique'),
('Autre')
) v(Libelle)
WHERE NOT EXISTS (
    SELECT 1 
    FROM [comm].[CauseEchecs] c
    WHERE c.Libelle = v.Libelle
);