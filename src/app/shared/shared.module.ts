import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { ErrorContentComponent } from 'src/app/shared/components/error/error-content/error-content.component';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { ChangeTeamDialogComponent } from './components/dialogs/change-team-dialog/change-team-dialog.component';
import { ErrorComponent } from './components/error/error.component';
import { FromToDatesComponent } from './components/from-to-dates/from-to-dates.component';
import { TabsVerticalComponent } from './components/tabs-vertical/tabs-vertical.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LoaderComponent } from './components/ui/loader/loader.component';
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
    DeviceDetectorModule,
    MatToolbarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule
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
    ResponsiveMatIconDirective,
    ToolbarComponent,
    ChangeTeamDialogComponent,
    TabsVerticalComponent,
    LoaderComponent
  ],
  exports: [
    ErrorComponent,
    FromToDatesComponent,
    DateFormatPipe,
    MobileHideDirective,
    ResponsiveMatIconDirective,
    ToolbarComponent,
    ChangeTeamDialogComponent,
    TabsVerticalComponent,
    LoaderComponent
  ],
  entryComponents: [ErrorContentComponent, ChangeTeamDialogComponent]
})
export class SharedModule {}
