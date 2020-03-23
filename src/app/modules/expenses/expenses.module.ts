import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExpensesContentComponent } from './components/expenses-content/expenses-content.component';
import { ExpensesListComponent } from './components/expenses-list/expenses-list.component';
import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesDesktopComponent } from './pages/expenses-desktop/expenses-desktop.component';
import { ExpensesMobileComponent } from './pages/expenses-mobile/expenses-mobile.component';
import { ExpensesEffects } from './store/effects/expenses.effects';
import * as fromExpensesState from './store/reducer/expenses.reducer';

@NgModule({
  declarations: [ExpensesMobileComponent, ExpensesDesktopComponent, ExpensesListComponent, ExpensesContentComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    FlexLayoutModule,
    ExpensesRoutingModule,
    StoreModule.forFeature(fromExpensesState.expensesStateFeatureKey, fromExpensesState.reducer),
    EffectsModule.forFeature([ExpensesEffects])
  ]
})
export class ExpensesModule {}
