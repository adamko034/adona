import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { ErrorFacade } from 'src/app/core/error/error.facade';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit, OnDestroy {
  private errors$: Observable<string>;
  private errorsSubscription: Subscription;

  constructor(private facade: ErrorFacade, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.errors$ = this.facade.getErrors();

    this.errorsSubscription = this.errors$.subscribe((message: string) => {
      if (message) {
        this.snackBar.open(message, null, {
          duration: 2000
        });
      }
    });
  }

  ngOnDestroy() {
    this.errorsSubscription.unsubscribe();
  }
}
