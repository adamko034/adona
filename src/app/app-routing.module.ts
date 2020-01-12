import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guard/auth.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: ContentLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/home/home.module').then(mod => mod.HomeModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import('./modules/calendar/calendar.module').then(mod => mod.AdonaCalendarModule)
      },
      {
        path: 'expenses',
        loadChildren: () => import('./modules/expenses/expenses.module').then(mod => mod.ExpensesModule)
      }
    ]
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
    loadChildren: () => import('./modules/auth/auth.module').then(mod => mod.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
