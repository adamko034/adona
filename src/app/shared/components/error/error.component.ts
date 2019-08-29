import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { ErrorFacade } from 'src/app/core/error/error.facade';

@Component({
  selector: 'app-error-content',
  template:
    '<div class="error-content"><mat-icon class="error-content-icon">error_outline</mat-icon>{{data.message}}</div>',
  styles: [
    '.error-content { display: flex }',
    '.error-content-icon {font-size: 30px; margin-right: 15px; height: 32px; align-self: center; color: red}'
  ]
})
export class ErrorContentComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}

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
        this.snackBar.openFromComponent(ErrorContentComponent, {
          duration: 5 * 1000,
          data: { message }
        });
      }
    });
  }

  ngOnDestroy() {
    this.errorsSubscription.unsubscribe();
  }
}
