import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesContentComponent } from './components/expenses-content/expenses-content.component';
import { MobileGuard } from './guard/mobile.guard';
import { ExpensesDesktopComponent } from './pages/expenses-desktop/expenses-desktop.component';
import { ExpensesMobileComponent } from './pages/expenses-mobile/expenses-mobile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/expenses/d',
    pathMatch: 'full'
  },
  {
    path: 'd',
    component: ExpensesDesktopComponent,
    canActivate: [MobileGuard],
    children: [
      {
        path: ':id',
        component: ExpensesContentComponent
      }
    ]
  },
  {
    path: 'm',
    component: ExpensesMobileComponent,
    canActivate: [MobileGuard]
  },
  {
    path: 'm/:id',
    component: ExpensesContentComponent,
    canActivate: [MobileGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule {}
