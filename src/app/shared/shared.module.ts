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
import { ToastrModule } from 'ngx-toastr';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { ChangeTeamDialogComponent } from './components/dialogs/change-team-dialog/change-team-dialog.component';
import { FromToDatesComponent } from './components/from-to-dates/from-to-dates.component';
import { TabsVerticalComponent } from './components/tabs-vertical/tabs-vertical.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AlertComponent } from './components/ui/alert/alert.component';
import { LoaderComponent } from './components/ui/loader/loader.component';
import { TabsHorizontalComponent } from './components/ui/tabs-horizontal/tabs-horizontal.component';
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
    RouterModule,
    ToastrModule.forRoot({
      disableTimeOut: true,
      closeButton: true,
      positionClass: 'toast-top-center',
      enableHtml: true,
      easeTime: 600
    })
  ],
  providers: [
    TimeService,
    EnvironmentService,
    DateFormatPipe,
    { provide: 'Window', useValue: window },
    { provide: 'Document', useValue: document }
  ],
  declarations: [
    FromToDatesComponent,
    DateFormatPipe,
    MobileHideDirective,
    ResponsiveMatIconDirective,
    ToolbarComponent,
    ChangeTeamDialogComponent,
    TabsVerticalComponent,
    LoaderComponent,
    AlertComponent,
    TabsHorizontalComponent
  ],
  exports: [
    FromToDatesComponent,
    DateFormatPipe,
    MobileHideDirective,
    ResponsiveMatIconDirective,
    ToolbarComponent,
    ChangeTeamDialogComponent,
    TabsVerticalComponent,
    LoaderComponent,
    AlertComponent,
    TabsHorizontalComponent
  ],
  entryComponents: [ChangeTeamDialogComponent]
})
export class SharedModule {}
