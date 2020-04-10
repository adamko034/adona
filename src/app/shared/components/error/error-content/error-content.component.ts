import { Component, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ErrorFacade } from 'src/app/core/error/error.facade';

@Component({
  selector: 'app-error-content',
  templateUrl: './error-content.component.html',
  styleUrls: ['./error-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ErrorContentComponent implements OnDestroy {
  constructor(
    private errorFacade: ErrorFacade,
    public snackBarRef: MatSnackBarRef<ErrorContentComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string }
  ) {}

  public ngOnDestroy(): void {
    this.errorFacade.clearError();
  }
}
