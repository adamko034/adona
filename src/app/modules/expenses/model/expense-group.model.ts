import { User } from 'src/app/core/user/model/user/user.model';
import { Expense } from './expense.model';

export interface ExpenseGroup {
  id: string;
  name: string;
  users: User[];
  expenses?: Expense[];
  lastUpdatedBy: string;
  lastUpdated: Date;
}
