import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

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
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      },
      {
        path: 'dashboard-admin',
        loadComponent: () => import('./pages/dashboard-admin/dashboard-admin').then((m) => m.DashboardAdmin),
        canActivate: [roleGuard],
        data: { roles: ['Admin'] }
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/produit-cerm/produit-cerm-list/produit-cerm-list').then((m) => m.ProduitCermList),
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      },
      {
        path: 'prospects',
        loadComponent: () => import('./pages/prospects/prospect-list/prospect-list').then((m) => m.ProspectList),
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      },
      {
        path: 'prospects/create',
        loadComponent: () => import('./pages/prospects/prospect-form/prospect-form').then((m) => m.ProspectForm),
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      },
      {
        path: 'prospects/edit/:id',
        loadComponent: () => import('./pages/prospects/prospect-form/prospect-form').then((m) => m.ProspectForm),
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      },
      {
        path: 'prospects/:id',
        loadComponent: () => import('./pages/prospects/prospect-detail/prospect-detail').then((m) => m.ProspectDetail),
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      },
      {
        path: 'prospections',
        loadComponent: () => import('./pages/prospections/prospection-list/prospection-list').then((m) => m.ProspectionList),
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      },
      {
        path: 'prospections/create',
        loadComponent: () => import('./pages/prospections/prospection-form/prospection-form').then((m) => m.ProspectionForm),
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      },
      {
        path: 'prospections/detail/:id',
        loadComponent: () => import('./pages/prospections/prospection-detail/prospection-detail').then((m) => m.ProspectionDetail),
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      },
      {
        path: 'prospections/edit/:id',
        loadComponent: () => import('./pages/prospections/prospection-form/prospection-form').then((m) => m.ProspectionForm),
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      },
      {
        path: 'ligne-prospections/create',
        loadComponent: () => import('./pages/ligne-prospections/ligne-prospection-form/ligne-prospection-form').then((m) => m.LigneProspectionForm),
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      },
      {
        path: 'ligne-prospections/edit/:id',
        loadComponent: () => import('./pages/ligne-prospections/ligne-prospection-form/ligne-prospection-form').then((m) => m.LigneProspectionForm),
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      },
      {
        path: 'ligne-prospections/:prospectionId',
        loadComponent: () => import('./pages/ligne-prospections/ligne-prospection-list/ligne-prospection-list').then((m) => m.LigneProspectionList),
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      },
      {
        path: 'reclamations',
        loadComponent: () => import('./pages/reclamations/reclamation-list/reclamation-list').then((m) => m.ReclamationList),
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      },
      {
        path: 'reclamations/create',
        loadComponent: () => import('./pages/reclamations/reclamation-form/reclamation-form').then((m) => m.ReclamationForm),
        canActivate: [roleGuard],
        data: { roles: ['Commercial'] }
      }
    ],
  },
];
