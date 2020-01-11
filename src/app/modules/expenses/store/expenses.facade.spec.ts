import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { SpiesBuilder } from '../../../utils/testUtils/builders/spies.builder';
import { ExpenseGroup } from '../model/expense-group.model';
import { ExpensesGroupTestBuilder } from '../utils/tests/expenses-group-test.builder';
import { expensesActionsTypes } from './actions/expenses.actions';
import { ExpensesFacade } from './expenses.facade';
import { ExpensesState } from './reducer/expenses.reducer';
import { expensesQueries } from './selectors/expenses.selectors';

describe('Expenses Facade', () => {
  let mockStore: MockStore<ExpensesState>;
  let facade: ExpensesFacade;

  const { routerFacade } = SpiesBuilder.init()
    .withRouterFacade()
    .build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    mockStore = TestBed.get<Store<ExpensesState>>(Store);
    facade = new ExpensesFacade(mockStore, routerFacade);
  });

  describe('Load Expenses', () => {
    it('should dispatch Expenses Requested Action', () => {
      // given
      const dispatchSpy = spyOn(mockStore, 'dispatch');

      // when
      facade.loadExpenses();

      // then
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: expensesActionsTypes.expensesRequested
      });
    });
  });

  describe('Get Expenses', () => {
    it('should return observable of sorted expenses', () => {
      // given
      const expenses = [
        ExpensesGroupTestBuilder.default()
          .withId('1')
          .withLastUpdatedDaysAdd(-10)
          .build(),
        ExpensesGroupTestBuilder.default()
          .withId('2')
          .withLastUpdatedDaysAdd(-4)
          .build(),
        ExpensesGroupTestBuilder.default()
          .withId('3')
          .withLastUpdatedDaysAdd(-8)
          .build(),
        ExpensesGroupTestBuilder.default()
          .withId('4')
          .withLastUpdatedDaysAdd(-1)
          .build()
      ];

      const expensesExpected = [expenses[3], expenses[1], expenses[2], expenses[0]];

      mockStore.overrideSelector(expensesQueries.selectExpenses, expenses);

      // when
      const result = facade.getExpenses();

      // then
      result.subscribe((actual: ExpenseGroup[]) => expect(actual).toEqual(expensesExpected));
    });
  });

  describe('Get Expenses Loaded', () => {
    [true, false].forEach(input => {
      it(`should return ${input.toString()}`, () => {
        // given
        mockStore.overrideSelector(expensesQueries.selectExpensesLoaded, input);

        // when
        const result = facade.getExpensesLoaded();

        // then
        result.subscribe(actual => expect(actual).toEqual(input));
      });
    });
  });

  describe('Get Expenses Group From Router Param', () => {
    it('should return expenses group', () => {
      // given
      const expensesGroup = ExpensesGroupTestBuilder.default().build();
      routerFacade.getRouteParams.and.returnValue(cold('-b', { b: { id: expensesGroup.id } }));
      mockStore.overrideSelector(expensesQueries.selectExpensesById, expensesGroup);

      // when
      const result = facade.getExpensesGroupFromRouteParams();

      // then
      expect(result).toBeObservable(cold('-c', { c: expensesGroup }));
    });
  });
});
