import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';
import { authGuard } from './core/guards/auth.guard';
import { rolesGuard } from './core/guards/roles.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'historique-commercial',
        canActivate: [rolesGuard(['MANAGER', 'ADMIN'])],
        loadComponent: () =>
          import('./pages/historique-commercial/historique-commercial').then((m) => m.HistoriqueCommercial),
      },
      {
        path: 'power-bi',
        canActivate: [rolesGuard(['MANAGER', 'ADMIN'])],
        loadComponent: () => import('./pages/power-bi/power-bi').then((m) => m.PowerBi),
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/produit-cerm/produit-cerm-list/produit-cerm-list').then((m) => m.ProduitCermList),
      },
      {
        path: 'prospects',
        loadComponent: () => import('./pages/prospects/prospect-list/prospect-list').then((m) => m.ProspectList),
      },
      {
        path: 'clients',
        loadComponent: () => import('./pages/clients/client-list/client-list').then((m) => m.ClientList),
      },
      {
        path: 'prospects/create',
        loadComponent: () => import('./pages/prospects/prospect-form/prospect-form').then((m) => m.ProspectForm),
      },
      {
        path: 'prospects/edit/:id',
        loadComponent: () => import('./pages/prospects/prospect-form/prospect-form').then((m) => m.ProspectForm),
      },
      {
        path: 'prospects/:id',
        loadComponent: () => import('./pages/prospects/prospect-detail/prospect-detail').then((m) => m.ProspectDetail),
      },
      {
        path: 'prospections/create',
        loadComponent: () => import('./pages/prospections/prospection-form/prospection-form').then((m) => m.ProspectionForm),
      },
      {
        path: 'prospections/detail/:id',
        loadComponent: () => import('./pages/prospections/prospection-detail/prospection-detail').then((m) => m.ProspectionDetail),
      },
      {
        path: 'prospections/edit/:id',
        loadComponent: () => import('./pages/prospections/prospection-form/prospection-form').then((m) => m.ProspectionForm),
      },
      { path: 'prospections', pathMatch: 'full', redirectTo: 'prospects' },
      {
        path: 'ligne-prospections/create',
        loadComponent: () => import('./pages/ligne-prospections/ligne-prospection-form/ligne-prospection-form').then((m) => m.LigneProspectionForm),
      },
      {
        path: 'ligne-prospections/edit/:id',
        loadComponent: () => import('./pages/ligne-prospections/ligne-prospection-form/ligne-prospection-form').then((m) => m.LigneProspectionForm),
      },
      {
        path: 'ligne-prospections/:prospectionId',
        loadComponent: () => import('./pages/ligne-prospections/ligne-prospection-list/ligne-prospection-list').then((m) => m.LigneProspectionList),
      },
      {
        path: 'reclamations',
        loadComponent: () => import('./pages/reclamations/reclamation-list/reclamation-list').then((m) => m.ReclamationList),
      },
      {
        path: 'reclamations/create',
        loadComponent: () => import('./pages/reclamations/reclamation-form/reclamation-form').then((m) => m.ReclamationForm),
      },
      {
        path: 'reclamations/edit/:id',
        loadComponent: () => import('./pages/reclamations/reclamation-form/reclamation-form').then((m) => m.ReclamationForm),
      },
      {
        path: 'utilisateur',
        canActivate: [rolesGuard(['ADMIN'])],
        loadComponent: () => import('./pages/users/users').then((m) => m.Users),
      },
    ],
  },
];
