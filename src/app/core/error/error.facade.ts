import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ErrorState } from '../store/reducers/error/error.reducer';
import { errorQueries } from '../store/selectors/error.selectors';

@Injectable()
export class ErrorFacade {
  constructor(private store: Store<ErrorState>) {}

  public getErrors(): Observable<string> {
    return this.store.pipe(select(errorQueries.selectErrorMessage));
  }
}
