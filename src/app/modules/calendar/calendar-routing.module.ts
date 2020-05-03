import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarMobileViewGuard } from 'src/app/modules/calendar/guards/calendar-mobile-view.guard';
import { CalendarComponent } from './pages/calendar/calendar.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'month',
    pathMatch: 'full'
  },
  {
    path: 'month',
    component: CalendarComponent,
    canActivate: [CalendarMobileViewGuard]
  },
  {
    path: 'week',
    component: CalendarComponent,
    canActivate: [CalendarMobileViewGuard]
  },
  {
    path: 'day',
    component: CalendarComponent
  },
  {
    path: 'list',
    component: CalendarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule {}
