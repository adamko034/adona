import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar/calendar.component';

@NgModule({
  declarations: [CalendarComponent],
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
