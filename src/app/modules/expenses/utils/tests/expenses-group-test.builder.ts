import { User } from 'src/app/core/user/model/user/user.model';
import { ExpenseGroup } from 'src/app/modules/expenses/model/expense-group.model';
import { DateTestBuilder } from 'src/app/utils/testUtils/builders/date-test.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';

export class ExpensesGroupTestBuilder {
  private model: ExpenseGroup;

  private constructor() {
    this.model = {
      id: 'id1',
      name: 'test expenses',
      lastUpdated: DateTestBuilder.now().build(),
      users: [UserTestBuilder.withDefaultData().build()],
      lastUpdatedBy: 'testUser'
    };
  }

  public static default(): ExpensesGroupTestBuilder {
    return new ExpensesGroupTestBuilder();
  }

  public withId(id: string): ExpensesGroupTestBuilder {
    this.model.id = id;
    return this;
  }

  public withName(name: string): ExpensesGroupTestBuilder {
    this.model.name = name;
    return this;
  }

  public withLastUpdatedBy(name: string): ExpensesGroupTestBuilder {
    this.model.lastUpdatedBy = name;
    return this;
  }

  public withLastUpdatedDaysAdd(days: number): ExpensesGroupTestBuilder {
    this.model.lastUpdated = DateTestBuilder.now().addDays(days).build();
    return this;
  }

  public withUsers(users: User[]): ExpensesGroupTestBuilder {
    this.model.users = users;
    return this;
  }

  public build(): ExpenseGroup {
    return this.model;
  }
}
