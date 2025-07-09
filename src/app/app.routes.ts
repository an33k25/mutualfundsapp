import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/home-component/home-component').then((m) => m.HomeComponent),
},{
    path: 'api',
    loadComponent: () => import('./components/api-service-component/api-service-component').then((m) => m.ApiServiceComponent),
   }
];
