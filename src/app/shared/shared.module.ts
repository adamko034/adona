import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule, MatSnackBarModule } from '@angular/material';
import { ErrorComponent, ErrorContentComponent } from './components/error/error.component';

@NgModule({
  imports: [CommonModule, MatSnackBarModule, MatIconModule],
  providers: [],
  declarations: [ErrorComponent, ErrorContentComponent],
  exports: [ErrorComponent],
  entryComponents: [ErrorContentComponent]
})
export class SharedModule {}
