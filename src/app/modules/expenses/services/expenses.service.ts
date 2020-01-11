import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ExpenseGroup } from '../model/expense-group.model';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private readonly collectionName = 'expenses';

  constructor(private db: AngularFirestore) {}

  public getExpenses(userId: string): Observable<ExpenseGroup[]> {
    return this.db
      .collection<ExpenseGroup>(this.collectionName, doc => doc.where('users', 'array-contains', userId))
      .valueChanges()
      .pipe(take(1));

    // const users = [
    //   { id: 'id1', email: 'aa', displayName: 'adam' },
    //   { id: 'id2', email: 'iw', displayName: 'iwona' }
    // ];

    // return of([
    //   ExpensesGroupTestBuilder.default()
    //     .withId('1')
    //     .withName('belgium')
    //     .withLastUpdatedDaysAdd(-7)
    //     .withLastUpdatedBy('adam')
    //     .withUsers(users)
    //     .build(),
    //   ExpensesGroupTestBuilder.default()
    //     .withId('2')
    //     .withName('shared')
    //     .withLastUpdatedBy('adam')
    //     .withLastUpdatedDaysAdd(-10)
    //     .withUsers(users)
    //     .build(),
    //   ExpensesGroupTestBuilder.default()
    //     .withId('3')
    //     .withName('bayern')
    //     .withLastUpdatedBy('iwona')
    //     .withLastUpdatedDaysAdd(-1)
    //     .withUsers(users)
    //     .build()
    // ]);
  }
}
