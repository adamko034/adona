import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { ErrorFacade } from 'src/app/core/error/error.facade';
import { ErrorContentComponent } from 'src/app/shared/components/error/error-content/error-content.component';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit, OnDestroy {
  private errors$: Observable<string>;
  private errorsSubscription: Subscription;

  constructor(private facade: ErrorFacade, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.errors$ = this.facade.selectError();

    this.errorsSubscription = this.errors$.subscribe((message: string) => {
      if (message) {
        this.snackBar.openFromComponent(ErrorContentComponent, {
          duration: 5 * 60 * 1000,
          data: { message },
          verticalPosition: 'top'
        });
      }
    });
  }

  ngOnDestroy() {
    this.errorsSubscription.unsubscribe();
  }
}
