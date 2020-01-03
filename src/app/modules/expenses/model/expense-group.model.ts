import { User } from 'src/app/core/auth/model/user-model';
import { Expense } from './expense.model';

export interface ExpenseGroup {
  id: string;
  name: string;
  users: User[];
  expenses?: Expense[];
}
