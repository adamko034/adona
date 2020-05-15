import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { errors } from 'src/app/core/error/constants/errors.constants';
import { ErrorTestDataBuilder } from 'src/app/core/error/utils/test/error-test-data.builder';
import { errorActions } from 'src/app/core/store/actions/error.actions';
import { UserFacade } from 'src/app/core/user/user.facade';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from '../../../../utils/testUtils/builders/user-test-builder';
import { ExpensesService } from '../../services/expenses.service';
import { ExpensesGroupTestBuilder } from '../../utils/tests/expenses-group-test.builder';
import { expensesActions } from '../actions/expenses.actions';
import { ExpensesEffects } from './expenses.effects';

describe('Expenses Effects', () => {
  let actions$: Observable<Action>;
  let effects: ExpensesEffects;

  const user = UserTestBuilder.withDefaultData().build();
  const expense = ExpensesGroupTestBuilder.default().withUsers([user]).build();

  const { userFacade, expensesService } = SpiesBuilder.init().withUserFacade().withExpensesService().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExpensesEffects,
        { provide: UserFacade, useValue: userFacade },
        { provide: ExpensesService, useValue: expensesService },
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject<ExpensesEffects>(ExpensesEffects);

    userFacade.selectUser.and.callFake(() => of(user));
    expensesService.getExpenses.and.returnValue(of([expense]));

    userFacade.selectUser.calls.reset();
    expensesService.getExpenses.calls.reset();
  });

  describe('Expenses Requested', () => {
    it('should switch to Expenses Load Success action', () => {
      // given
      actions$ = hot('--a', { a: expensesActions.expensesRequested() });
      const expected = cold('--b', { b: expensesActions.expensesLoadSuccess({ expenses: [expense] }) });

      // when & then
      expect(effects.expensesRequested$).toBeObservable(expected);
      expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
      expect(expensesService.getExpenses).toHaveBeenCalledTimes(1);
      expect(expensesService.getExpenses).toHaveBeenCalledWith(user.id);
    });

    it('should switch to Expenses Load Failure action if getting data from service fails', () => {
      // given
      const serviceError = new Error('test error');
      actions$ = hot('--a', { a: expensesActions.expensesRequested() });
      const expected = cold('----(b|)', {
        b: expensesActions.expensesLoadFailure({ error: { errorObj: serviceError } })
      });

      expensesService.getExpenses.and.returnValue(cold('--#|', {}, serviceError));

      // when & then
      expect(effects.expensesRequested$).toBeObservable(expected);
      expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
      expect(expensesService.getExpenses).toHaveBeenCalledTimes(1);
      expect(expensesService.getExpenses).toHaveBeenCalledWith(user.id);
    });
  });

  describe('Expenses Loaded Error', () => {
    it('should map to Error Broadcast action with custom message', () => {
      // given
      const error = ErrorTestDataBuilder.from().withDefaultData().build();
      actions$ = hot('--a', { a: expensesActions.expensesLoadFailure({ error }) });

      const expected = cold('--b', { b: errorActions.handleError({ error }) });

      // when & then
      expect(effects.expensesLoadFailure$).toBeObservable(expected);
    });

    it('should map to Error Broadcast action with default message', () => {
      // given
      const errorSource = ErrorTestDataBuilder.from().withDefaultData().withMessage(null).build();
      actions$ = hot('--a', { a: expensesActions.expensesLoadFailure({ error: errorSource }) });

      const expected = cold('--b', {
        b: errorActions.handleError({
          error: { message: errors.DEFAULT_MESSAGE, errorObj: errorSource.errorObj }
        })
      });

      // when & then
      expect(effects.expensesLoadFailure$).toBeObservable(expected);
    });
  });
});
