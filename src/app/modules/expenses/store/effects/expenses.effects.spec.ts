import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { UserTestBuilder } from '../../../../utils/testUtils/builders/user-test-builder';
import { ExpensesService } from '../../services/expenses.service';
import { ExpensesGroupTestBuilder } from '../../utils/tests/expenses-group-test.builder';
import { actions } from '../actions/expenses.actions';
import { ExpensesEffects } from './expenses.effects';

fdescribe('Expenses Effects', () => {
  let actions$: Observable<Action>;
  let effects: ExpensesEffects;

  const user = new UserTestBuilder().withDefaultData().build();
  const expense = ExpensesGroupTestBuilder.default()
    .withUsers([user])
    .build();

  const authFacade = jasmine.createSpyObj<AuthFacade>('authFacade', ['getUser']);
  const expensesService = jasmine.createSpyObj<ExpensesService>('expensesService', ['getExpenses']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExpensesEffects,
        { provide: AuthFacade, useValue: authFacade },
        { provide: ExpensesService, useValue: expensesService },
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<ExpensesEffects>(ExpensesEffects);

    authFacade.getUser.and.callFake(() => of(user));
    expensesService.getExpenses.and.returnValue(of([expense]));

    authFacade.getUser.calls.reset();
    expensesService.getExpenses.calls.reset();
  });

  describe('Expenses Requested', () => {
    it('should switch to Expenses Load Success action', () => {
      // given
      actions$ = hot('--a', { a: actions.expensesRequested() });
      const expected = cold('--b', { b: actions.expensesLoadSuccess({ expenses: [expense] }) });

      // when & then
      expect(effects.expensesRequested$).toBeObservable(expected);
      expect(authFacade.getUser).toHaveBeenCalledTimes(1);
      expect(expensesService.getExpenses).toHaveBeenCalledTimes(1);
      expect(expensesService.getExpenses).toHaveBeenCalledWith(user.id);
    });
  });
});
