import { Component, OnInit } from '@angular/core';
import { ExpenseGroup } from '../../model/expense-group.model';
import { ExpensesFacade } from '../../store/expenses.facade';

@Component({
  selector: 'app-expenses-content',
  templateUrl: './expenses-content.component.html',
  styleUrls: ['./expenses-content.component.scss']
})
export class ExpensesContentComponent implements OnInit {
  public expenseGroup: ExpenseGroup;

  constructor(private expenseFacade: ExpensesFacade) {}

  public ngOnInit() {
    this.expenseFacade.getExpensesGroupFromRouteParams().subscribe((expenseGroup: ExpenseGroup) => {
      this.expenseGroup = expenseGroup;
    });
  }
}
