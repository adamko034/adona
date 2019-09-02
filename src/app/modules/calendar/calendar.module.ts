import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import { EffectsModule } from '@ngrx/effects';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarMapper } from 'src/app/modules/calendar/mappers/event.mapper';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import { CalendarEffects } from 'src/app/modules/calendar/store/effects/calendar.effects';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarTitleComponent } from './components/calendar-title/calendar-title.component';
import { CalendarViewSwitchComponent } from './components/calendar-view-switch/calendar-view-switch.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { NewEventDialogComponent } from './components/new-event-dialog/new-event-dialog.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { CalendarFacade } from './store/calendar.facade';

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
    SharedModule,
    CalendarRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    EffectsModule.forFeature([CalendarEffects]),
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDatepickerModule,
    ReactiveFormsModule
  ],
  providers: [CalendarService, CalendarFacade, CalendarMapper]
})
export class AdonaCalendarModule {}
