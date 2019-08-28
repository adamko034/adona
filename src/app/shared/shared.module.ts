import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  imports: [CommonModule, MatSnackBarModule],
  providers: [],
  declarations: [ErrorComponent],
  exports: [ErrorComponent]
})
export class SharedModule {}
