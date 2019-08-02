import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarTitleComponent } from './components/calendar-title/calendar-title.component';
import { CalendarViewSwitchComponent } from './components/calendar-view-switch/calendar-view-switch.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { NewEventDialogComponent } from './components/new-event-dialog/new-event-dialog.component';
import { CalendarComponent } from './pages/calendar/calendar.component';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarViewComponent,
    CalendarViewSwitchComponent,
    CalendarTitleComponent,
    NewEventDialogComponent
  ],
  entryComponents: [NewEventDialogComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    MatDialogModule
  ]
})
export class AdonaCalendarModule {}
