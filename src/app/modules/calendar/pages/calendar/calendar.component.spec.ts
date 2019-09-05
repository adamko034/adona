import { MatDialog } from '@angular/material';
import { CalendarView } from 'angular-calendar';
import { CalendarFacade } from '../../store/calendar.facade';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  const calendarFacade = jasmine.createSpyObj<CalendarFacade>('CalendarFacade', ['loadAllEvents']);
  const dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(() => {
    component = new CalendarComponent(calendarFacade, dialog);
    calendarFacade.loadAllEvents.calls.reset();
  });

  describe('OnInit', () => {
    it('should call for all events', () => {
      // when
      component.ngOnInit();

      // then
      expect(calendarFacade.loadAllEvents).toHaveBeenCalledTimes(1);
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
