import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_ROUTER } from '@core/constants';
import { LayoutComponent } from './layout/pages/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: APP_ROUTER.LOGIN,
    pathMatch: 'full',
  },
  {
    path: APP_ROUTER.LOGIN,
    loadComponent: () => import('./modules/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: APP_ROUTER.REDIRECT,
    loadComponent: () => import('./modules/redirect/redirect.component').then((m) => m.RedirectComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: APP_ROUTER.HOME,
        pathMatch: 'full',
      },
      {
        path: APP_ROUTER.HOME,
        loadComponent: () => import('./modules/home/home.component').then((m) => m.HomeComponent),
      },
    ]
  }]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
