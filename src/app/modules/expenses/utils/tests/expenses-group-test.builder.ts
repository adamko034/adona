// import { DateTestBuilder } from 'src/app/utils/testUtils/builders/date-test.builder';
// import { User } from '../../../../core/user/model/user.model';
// import { UserTestBuilder } from '../../../../utils/testUtils/builders/user-test-builder';
// import { ExpenseGroup } from '../../model/expense-group.model';

// export class ExpensesGroupTestBuilder {
//   private model: ExpenseGroup;

//   private constructor() {
//     this.model = {
//       id: 'id1',
//       name: 'test expenses',
//       lastUpdated: DateTestBuilder.today().build(),
//       users: [new UserTestBuilder().withDefaultData().build()],
//       lastUpdatedBy: 'testUser'
//     };
//   }

//   public static default(): ExpensesGroupTestBuilder {
//     return new ExpensesGroupTestBuilder();
//   }

//   public withId(id: string): ExpensesGroupTestBuilder {
//     this.model.id = id;
//     return this;
//   }

//   public withName(name: string): ExpensesGroupTestBuilder {
//     this.model.name = name;
//     return this;
//   }

//   public withLastUpdatedBy(name: string): ExpensesGroupTestBuilder {
//     this.model.lastUpdatedBy = name;
//     return this;
//   }

//   public withLastUpdatedDaysAdd(days: number): ExpensesGroupTestBuilder {
//     this.model.lastUpdated = DateTestBuilder.today()
//       .addDays(days)
//       .build();
//     return this;
//   }

//   public withUsers(users: User[]): ExpensesGroupTestBuilder {
//     this.model.users = users;
//     return this;
//   }

//   public build(): ExpenseGroup {
//     return this.model;
//   }
// }
