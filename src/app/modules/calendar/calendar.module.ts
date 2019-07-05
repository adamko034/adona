import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarTitleComponent } from './components/calendar-title/calendar-title.component';
import { CalendarViewSwitchComponent } from './components/calendar-view-switch/calendar-view-switch.component';
import { CalendarViewComponent } from './components/calendar/calendar-view.component';
import { CalendarComponent } from './pages/calendar/calendar.component';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarViewComponent,
    CalendarViewSwitchComponent,
    CalendarTitleComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ]
})
export class AdonaCalendarModule {}
