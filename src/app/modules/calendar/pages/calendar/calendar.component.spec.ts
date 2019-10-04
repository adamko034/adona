import { MatDialog } from '@angular/material';
import { CalendarView } from 'angular-calendar';
import { TimeExtractionService } from 'src/app/shared/services/time/parts/time-extraction.service';
import { CalendarFacade } from '../../store/calendar.facade';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  const calendarFacade = jasmine.createSpyObj<CalendarFacade>('CalendarFacade', ['loadMonthEvents']);
  const dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  const timeService: any = {
    Extraction: jasmine.createSpyObj<TimeExtractionService>('TimeExtractionService', ['getPreviousMonthOf'])
  };

  beforeEach(() => {
    component = new CalendarComponent(calendarFacade, dialog, timeService);
    calendarFacade.loadMonthEvents.calls.reset();
  });

  describe('OnInit', () => {
    it('should call for all events', () => {
      // when
      component.ngOnInit();

      // then
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledTimes(2);
    });
  });

  it('should default to month view', () => {
    expect(component.view).toBe(CalendarView.Month);
    expect(component.viewDate.toDateString()).toBe(new Date().toDateString());
  });

  it('should change view type', () => {
    component.onViewChanged(CalendarView.Day);
    expect(component.view).toBe(CalendarView.Day);
    expect(component.viewDate.toDateString()).toBe(new Date().toDateString());

    component.onViewChanged(CalendarView.Week);
    expect(component.view).toBe(CalendarView.Week);
    expect(component.viewDate.toDateString()).toBe(new Date().toDateString());

    component.onViewChanged(CalendarView.Month);
    expect(component.view).toBe(CalendarView.Month);
    expect(component.viewDate.toDateString()).toBe(new Date().toDateString());
  });
});
