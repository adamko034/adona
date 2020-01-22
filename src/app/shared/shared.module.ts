import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { ErrorComponent, ErrorContentComponent } from './components/error/error.component';
import { FromToDatesComponent } from './components/from-to-dates/from-to-dates.component';
import { MobileHideDirective } from './directives/device/mobile-hide.directive';
import { ResponsiveMatIconDirective } from './directives/device/responsive-mat-icon.directive';
import { DateFormatPipe } from './pipes/date/date-format.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    FlexLayoutModule,
    DeviceDetectorModule
  ],
  providers: [
    TimeService,
    EnvironmentService,
    DateFormatPipe,
    { provide: 'Window', useValue: window },
    { provide: 'Document', useValue: document }
  ],
  declarations: [
    ErrorComponent,
    ErrorContentComponent,
    FromToDatesComponent,
    DateFormatPipe,
    MobileHideDirective,
    ResponsiveMatIconDirective
  ],
  exports: [ErrorComponent, FromToDatesComponent, DateFormatPipe, MobileHideDirective, ResponsiveMatIconDirective],
  entryComponents: [ErrorContentComponent]
})
export class SharedModule {}
