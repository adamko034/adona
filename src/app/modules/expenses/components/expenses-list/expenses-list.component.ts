import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { DateFormat } from 'src/app/shared/services/time/model/date-format.enum';
import { ExpenseGroup } from '../../model/expense-group.model';
import { ExpensesFacade } from '../../store/expenses.facade';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent implements OnInit {
  @Input()
  public isMobile: boolean;

  private selectedExpensesId: string;
  public expenses: ExpenseGroup[];
  public daysAgoFormat = DateFormat.DaysAgo;

  constructor(private navigationService: NavigationService, private expensesFacade: ExpensesFacade) {}

  public ngOnInit() {
    this.expensesFacade.loadExpenses();

    this.expensesFacade.getExpenses().subscribe((expenses: ExpenseGroup[]) => {
      this.expenses = expenses;
      this.handleDesktopSelectedExpense();
    });
  }

  public onExpenseSelected(expense: ExpenseGroup) {
    this.selectedExpensesId = expense.id;
    this.navigationService.toExpenseContent(expense.id);
  }

  public shouldBeSelected(expense: ExpenseGroup) {
    return !this.isMobile && expense.id === this.selectedExpensesId;
  }

  private handleDesktopSelectedExpense() {
    if (this.expenses.length > 0 && !this.isMobile) {
      this.onExpenseSelected(this.expenses[0]);
    }
  }
}
