import { User } from '../../../../core/auth/model/user-model';
import { UserTestBuilder } from '../../../../utils/testUtils/builders/user-test-builder';
import { ExpenseGroup } from '../../model/expense-group.model';

export class ExpensesGroupTestBuilder {
  private model: ExpenseGroup;

  private constructor() {
    this.model = { id: 'id1', name: 'test expenses', users: [new UserTestBuilder().withDefaultData().build()] };
  }

  public static default(): ExpensesGroupTestBuilder {
    return new ExpensesGroupTestBuilder();
  }

  public withUsers(users: User[]): ExpensesGroupTestBuilder {
    this.model.users = users;
    return this;
  }

  public build(): ExpenseGroup {
    return this.model;
  }
}
