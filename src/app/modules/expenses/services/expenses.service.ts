import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ExpensesModule } from '../expenses.module';
import { ExpenseGroup } from '../model/expense-group.model';

@Injectable({ providedIn: ExpensesModule })
export class ExpensesService {
  private readonly collectionName: string = '/expenses';

  constructor(private db: AngularFirestore) {}

  public getExpenses(userId: string): Observable<ExpenseGroup[]> {
    return this.db
      .collection<ExpenseGroup>(this.collectionName, doc => doc.where('users', 'array-contains', userId))
      .valueChanges()
      .pipe(take(1));
  }
}
