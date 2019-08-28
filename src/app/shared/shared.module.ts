import { NgModule } from '@angular/core';
import { ErrorComponent } from './components/error/error.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  providers: [],
  declarations: [ErrorComponent],
  exports: [ErrorComponent]
})
export class SharedModule {}
