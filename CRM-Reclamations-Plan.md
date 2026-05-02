# Plan d'Implémentation : Module de Gestion des Réclamations

Ce document détaille les étapes techniques pour intégrer le module de gestion des réclamations dans l'architecture existante de votre CRM (ASP.NET Core / Angular / SQL Server).

## 1. Couche Base de Données (`CRM.Database`)
Créer les nouveaux scripts SQL pour les tables liées aux réclamations.

*   Créer une table `Reclamation` :
    *   `Id` (INT, PK, Identity)
    *   `Titre` (NVARCHAR)
    *   `Description` (NVARCHAR MAX)
    *   `Statut` (INT ou VARCHAR : Nouveau, En cours, Résolu, Rejeté)
    *   `Priorite` (INT ou VARCHAR : Basse, Moyenne, Haute)
    *   `ClientId` / `ProspectId` (FK)
    *   `ResponsableId` (FK vers Utilisateur - Commercial/Admin)
    *   `CreatedAt`, `UpdatedAt`
*   Créer une table `ReclamationHistorique` :
    *   `Id` (INT, PK, Identity)
    *   `ReclamationId` (FK)
    *   `Action` (NVARCHAR : Création, Modification Statut, Assignation...)
    *   `ResponsableId` (FK)
    *   `DateAction` (DATETIME)

## 2. Couche Entités (`CRM.Entities`)
Créer les modèles en C# correspondants aux tables.
*   `CRM.Entities/Crm/Reclamation.cs`
*   `CRM.Entities/Crm/ReclamationHistorique.cs`

## 3. Couche Accès aux Données (`CRM.DAL`)
Ajouter les repositories pour accéder aux données.
*   Ajouter les `DbSet<Reclamation>` et `DbSet<ReclamationHistorique>` dans le `DataContext.cs`.
*   Créer `IReclamationRepository.cs` et `ReclamationRepository.cs` (ou utiliser `IGenericRepository` s'il couvre tous les besoins).

## 4. Couche Services (`CRM.Services`)
Implémenter la logique métier (business rules) des réclamations.
*   Créer un dossier `Reclamations/` dans `CRM.Services`.
*   Créer `IReclamationService.cs` (Méthodes : `CreateAsync`, `GetByIdAsync`, `GetAllAsync`, `UpdateStatusAsync`, `AssignAsync`, etc.).
*   Créer `ReclamationService.cs` : 
    *   Lors de la création ou d'un changement d'état d'une réclamation, le service doit systématiquement insérer une entrée dans `ReclamationHistorique`.

## 5. Couche API (`CRM.WebAPI`)
Exposer les points d'entrée HTTP (Endpoints) pour l'application Frontend.
*   Créer des DTOs dans `CRM.WebAPI/DTOs/Reclamations/` : `ReclamationCreateDto`, `ReclamationUpdateDto`, `ReclamationResponseDto`.
*   Créer `ReclamationController.cs` dans `Controllers/`.
*   Sécuriser le contrôleur avec l'attribut `[Authorize]` et utiliser les rôles (`[Authorize(Roles = "Admin,Commercial")]`) pour restreindre l'accès à certaines fonctionnalités comme l'assignation ou la suppression.

## 6. Couche Frontend (`CRM.WEB` - Angular)
Développer l'interface utilisateur.
*   **Modèles** : Créer `reclamation.model.ts` dans Angular.
*   **Services** : Créer `reclamation.service.ts` pour appeler l'API WebAPI (méthodes HTTP GET, POST, PUT, DELETE).
*   **Composants** (à générer sous `src/app/pages/reclamations/`) :
    *   `reclamation-list` : Tableau de bord pour lister, filtrer et rechercher les réclamations.
    *   `reclamation-form` : Formulaire pour créer ou modifier une réclamation.
    *   `reclamation-details` : Vue détaillée d'une réclamation incluant son historique.
*   **Routing** : Mettre à jour `app-routing.module.ts` pour inclure les routes vers ces nouveaux composants.

## 7. Prochaines Étapes (Évolutions futures)
Une fois le cœur du module terminé :
*   **Notifications** : Intégrer SignalR dans `CRM.WebAPI` pour notifier en temps réel un commercial lorsqu'une réclamation lui est assignée.
*   **Pièces jointes** : Ajouter une gestion de fichiers (Upload/Download) liée aux réclamations.
*   **Dashboarding** : Ajouter des widgets statistiques sur la page d'accueil d'Angular (nombre de réclamations ouvertes, délai moyen de résolution, etc.).
