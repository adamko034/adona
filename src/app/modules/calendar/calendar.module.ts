import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import { CalendarEventEffects } from 'src/app/modules/calendar/store/effects/event/calendar-event.effects';
import { CalendarEventsEffects } from 'src/app/modules/calendar/store/effects/events/calendar-events.effects';
import { CalendarUiEffects } from 'src/app/modules/calendar/store/effects/ui/calendar-ui.effects';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarTitleComponent } from './components/calendar-title/calendar-title.component';
import { CalendarDateSwitchComponent } from './components/calendar-toolbar/calendar-date-switch/calendar-date-switch.component';
import { CalendarListScrollComponent } from './components/calendar-toolbar/calendar-list-scroll/calendar-list-scroll.component';
import { CalendarToolbarComponent } from './components/calendar-toolbar/calendar-toolbar.component';
import { CalendarViewSwitchComponent } from './components/calendar-toolbar/calendar-view-switch/calendar-view-switch.component';
import { CalendarViewListComponent } from './components/calendar-view/calendar-view-list/calendar-view-list.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { NewEventDialogComponent } from './components/dialogs/new-event-dialog/new-event-dialog.component';
import { CalendarMapper } from './mappers/calendar.mapper';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { CalendarFacade } from './store/calendar.facade';
import * as fromReducer from './store/reducers/calendar.reducer';

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
    EffectsModule.forFeature([CalendarEventEffects, CalendarUiEffects, CalendarEventsEffects]),
    MatDialogModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    MatNativeDateModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    StoreModule.forFeature('calendar', fromReducer.reducer)
  ],
  providers: [CalendarService, CalendarFacade, CalendarMapper]
})
export class AdonaCalendarModule {}
