import { of } from 'rxjs';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { ExpenseGroup } from '../../model/expense-group.model';
import { ExpensesGroupTestBuilder } from '../../utils/tests/expenses-group-test.builder';
import { ExpensesListComponent } from './expenses-list.component';

describe('Expenses List Component', () => {
  let component: ExpensesListComponent;
  const expenses: ExpenseGroup[] = [
    ExpensesGroupTestBuilder.default()
      .withId('1')
      .withLastUpdatedDaysAdd(0)
      .build(),
    ExpensesGroupTestBuilder.default()
      .withId('2')
      .withLastUpdatedDaysAdd(-10)
      .build(),
    ExpensesGroupTestBuilder.default()
      .withId('3')
      .withLastUpdatedDaysAdd(-13)
      .build()
  ];

  const { navigationService, expensesFacade } = SpiesBuilder.init()
    .withNavigationService()
    .withExpensesFacade()
    .build();

  beforeEach(() => {
    component = new ExpensesListComponent(navigationService, expensesFacade);

    navigationService.toExpenseContent.calls.reset();
  });

  describe('On Init', () => {
    beforeEach(() => {
      expensesFacade.loadExpenses.calls.reset();
      expensesFacade.getExpenses.calls.reset();

      expensesFacade.getExpenses.and.returnValue(of(expenses));
    });

    it('should load and store expenses', () => {
      // when
      component.ngOnInit();

      // then
      expect(expensesFacade.loadExpenses).toHaveBeenCalledTimes(1);
      expect(expensesFacade.getExpenses).toHaveBeenCalledTimes(1);
      expect(component.expenses).toEqual(expenses);
    });

    it('should not set selected group id and not navigate to expenses content when there are no expenses', () => {
      // given
      component.isMobile = false;
      expensesFacade.getExpenses.and.returnValue(of([]));

      // when
      component.ngOnInit();

      // then
      expect(expensesFacade.loadExpenses).toHaveBeenCalledTimes(1);
      expect(expensesFacade.getExpenses).toHaveBeenCalledTimes(1);
      expect(component.expenses).toEqual([]);
      expect((component as any).selectedExpensesId).toBeFalsy();
      expect(navigationService.toExpenseContent).not.toHaveBeenCalled();
    });

    it('should not set selected group id and not navigate to expenses content when on mobile', () => {
      // given
      component.isMobile = true;

      // when
      component.ngOnInit();

      // then
      expect(expensesFacade.loadExpenses).toHaveBeenCalledTimes(1);
      expect(expensesFacade.getExpenses).toHaveBeenCalledTimes(1);
      expect(component.expenses).toEqual(expenses);
      expect((component as any).selectedExpensesId).toBeFalsy();
      expect(navigationService.toExpenseContent).not.toHaveBeenCalled();
    });

    it('should mark as selected the latest updated group and navigate to content', () => {
      // given
      component.isMobile = false;

      // when
      component.ngOnInit();

      // then
      expect(expensesFacade.loadExpenses).toHaveBeenCalledTimes(1);
      expect(expensesFacade.getExpenses).toHaveBeenCalledTimes(1);
      expect(component.expenses).toEqual(expenses);
      expect((component as any).selectedExpensesId).toEqual('1');
      expect(navigationService.toExpenseContent).toHaveBeenCalledTimes(1);
      expect(navigationService.toExpenseContent).toHaveBeenCalledWith('1');
    });
  });

  describe('On Expense Selected', () => {
    it('should change selected expense id and navigate to this expense content', () => {
      // given
      const expense = expenses[0];

      // when
      component.onExpenseSelected(expense);

      // then
      expect((component as any).selectedExpensesId).toEqual(expense.id);
      expect(navigationService.toExpenseContent).toHaveBeenCalledTimes(1);
      expect(navigationService.toExpenseContent).toHaveBeenCalledWith(expense.id);
    });
  });

  describe('Should Be Selected', () => {
    it('should return true if on desktop and expense is selected', () => {
      // given
      const expense = expenses[0];
      (component as any).selectedExpensesId = expense.id;

      component.isMobile = false;

      // when
      const result = component.shouldBeSelected(expense);

      // then
      expect(result).toBeTruthy();
    });

    it('should return false if on mobile', () => {
      // given
      const expense = expenses[0];
      (component as any).selectedExpensesId = expense.id;

      component.isMobile = true;

      // when
      const result = component.shouldBeSelected(expense);

      // then
      expect(result).toBeFalsy();
    });

    it('should return false if on desktop but for not selected expense', () => {
      // given
      const expense = expenses[0];
      (component as any).selectedExpensesId = 'otherId';

      component.isMobile = false;

      // when
      const result = component.shouldBeSelected(expense);

      // then
      expect(result).toBeFalsy();
    });
  });
});
