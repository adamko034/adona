import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatToolbarModule
} from '@angular/material';
import { EffectsModule } from '@ngrx/effects';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import { CalendarEffects } from 'src/app/modules/calendar/store/effects/calendar.effects';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarTitleComponent } from './components/calendar-title/calendar-title.component';
import { CalendarDateSwitchComponent } from './components/calendar-toolbar/calendar-date-switch/calendar-date-switch.component';
import { CalendarListScrollComponent } from './components/calendar-toolbar/calendar-list-scroll/calendar-list-scroll.component';
import { CalendarToolbarComponent } from './components/calendar-toolbar/calendar-toolbar.component';
import { CalendarViewSwitchComponent } from './components/calendar-view-switch/calendar-view-switch.component';
import { CalendarViewListComponent } from './components/calendar-view/calendar-view-list/calendar-view-list.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { NewEventDialogComponent } from './components/dialogs/new-event-dialog/new-event-dialog.component';
import { CalendarMapper } from './mappers/calendar.mapper';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { CalendarFacade } from './store/calendar.facade';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarViewComponent,
    CalendarViewSwitchComponent,
    CalendarTitleComponent,
    NewEventDialogComponent,
    CalendarDateSwitchComponent,
    CalendarViewListComponent,
    CalendarToolbarComponent,
    CalendarListScrollComponent
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
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    MatNativeDateModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  providers: [CalendarService, CalendarFacade, CalendarMapper]
})
export class AdonaCalendarModule {}
