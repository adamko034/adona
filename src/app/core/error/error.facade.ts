import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { errorActions } from 'src/app/core/store/actions/error.actions';
import { ErrorState } from '../store/reducers/error/error.reducer';
import { errorQueries } from '../store/selectors/error.selectors';

@Injectable()
export class ErrorFacade {
  constructor(private store: Store<ErrorState>) {}

  public selectError(): Observable<string> {
    return this.store.pipe(select(errorQueries.selectErrorMessage));
  }

  public clearError(): void {
    this.store.dispatch(errorActions.clear());
  }
}
