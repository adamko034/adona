// import { ExpensesGroupTestBuilder } from '../../utils/tests/expenses-group-test.builder';
// import { expensesActions, expensesActionsTypes } from './expenses.actions';

// describe('Expenses Actions', () => {
//   it('should create expenses requested actions', () => {
//     // when
//     const action = expensesActions.expensesRequested();

//     // then
//     expect({ ...action }).toEqual({ type: expensesActionsTypes.expensesRequested });
//   });

//   it('should create expenses loaded success action', () => {
//     // given
//     const expenses = [ExpensesGroupTestBuilder.default().build()];

//     // when
//     const action = expensesActions.expensesLoadSuccess({ expenses });

//     // then
//     expect({ ...action }).toEqual({ type: expensesActionsTypes.expensesLoadedSuccess, expenses });
//   });

//   it('should create expenses loaded failure action', () => {
//     // given

//     // when
//     const action = expensesActions.expensesLoadFailure({ error: { message: 'test' } });

//     // then
//     expect({ ...action }).toEqual({ type: expensesActionsTypes.expensesLoadedFailure, error: { message: 'test' } });
//   });
// });
