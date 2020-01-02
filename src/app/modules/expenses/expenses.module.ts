import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExpensesContentComponent } from './components/expenses-content/expenses-content.component';
import { ExpensesListComponent } from './components/expenses-list/expenses-list.component';
import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesDesktopComponent } from './pages/expenses-desktop/expenses-desktop.component';
import { ExpensesMobileComponent } from './pages/expenses-mobile/expenses-mobile.component';

@NgModule({
  declarations: [ExpensesMobileComponent, ExpensesDesktopComponent, ExpensesListComponent, ExpensesContentComponent],
  imports: [CommonModule, ExpensesRoutingModule]
})
export class ExpensesModule {}
