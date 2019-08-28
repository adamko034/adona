import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ErrorState } from 'src/app/core/store/reducers/error/error.reducer';
import { Observable } from 'rxjs';
import { errorQueries } from 'src/app/core/store/selectors/error.selectors';
import { AppState } from 'src/app/core/store/reducers';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  public errors$: Observable<string>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.errors$ = this.store.pipe(select(errorQueries.selectErrorMessage));
  }
}
