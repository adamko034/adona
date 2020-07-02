import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClearToastrGuard } from 'src/app/core/gui/guards/clear-toastr/clear-toastr.guard';
import { TeamLoadedGuard } from 'src/app/core/team/guards/team-loaded/team-loaded.guard';
import { HandleUserInvitationGuard } from 'src/app/core/user/guards/user-has-invitation/handle-user-invitation.guard';
import { UserLoadedGuard } from 'src/app/core/user/guards/user-loaded/user-loaded.guard';
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
    path: '',
    component: ContentLayoutComponent,
    canActivate: [AuthGuard, UserLoadedGuard, TeamLoadedGuard, HandleUserInvitationGuard, ClearToastrGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then((mod) => mod.HomeModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import('./modules/calendar/calendar.module').then((mod) => mod.AdonaCalendarModule)
      },
      {
        path: 'expenses',
        loadChildren: () => import('./modules/expenses/expenses.module').then((mod) => mod.ExpensesModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/settings/settings.module').then((mod) => mod.SettingsModule)
      }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [ClearToastrGuard],
    loadChildren: () => import('./modules/auth/auth.module').then((mod) => mod.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
