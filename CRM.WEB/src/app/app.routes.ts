import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';
import { authGuard } from './core/guards/auth.guard';

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
        path: 'prospects',
        loadComponent: () => import('./pages/prospects/prospect-list/prospect-list').then((m) => m.ProspectList),
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
        path: 'prospections',
        loadComponent: () => import('./pages/prospections/prospection-list/prospection-list').then((m) => m.ProspectionList),
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
    ],
  },
];
