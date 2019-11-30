import { MatDialog } from '@angular/material';
import { CalendarView } from 'angular-calendar';
import { of, Subject } from 'rxjs';
import { TimeExtractionService } from 'src/app/shared/services/time/parts/time-extraction.service';
import { NewEventDialogComponent } from '../../components/dialogs/new-event-dialog/new-event-dialog.component';
import { CalendarFacade } from '../../store/calendar.facade';
import { EventsTestDataBuilder } from '../../utils/tests/event-test-data.builder';
import { CalendarComponent } from './calendar.component';
import { AdonaCalendarModule } from 'src/app/modules/calendar/calendar.module';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view.model';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  const calendarFacade = jasmine.createSpyObj<CalendarFacade>('CalendarFacade', ['loadMonthEvents', 'addEvent']);
  const dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  const timeService: any = {
    Extraction: jasmine.createSpyObj<TimeExtractionService>('TimeExtractionService', ['getPreviousMonthOf'])
  };

  beforeEach(() => {
    component = new CalendarComponent(calendarFacade, dialog, timeService);

    calendarFacade.loadMonthEvents.calls.reset();
    calendarFacade.addEvent.calls.reset();
    dialog.open.calls.reset();
  });

  describe('On Init', () => {
    it('should call for events for this and previous month', () => {
      // given
      const viewDate = new Date(2019, 10, 10);
      const previousMonth = new Date(2019, 9, 10);

      component.viewDate = viewDate;
      timeService.Extraction.getPreviousMonthOf.and.returnValue(previousMonth);

      // when
      component.ngOnInit();

      // then
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledTimes(2);
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledWith(viewDate);
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledWith(previousMonth);
    });

    it('should default to month view', () => {
      expect(component.view).toEqual({ view: CalendarView.Month, isList: false });
      expect(component.viewDate.toDateString()).toEqual(new Date().toDateString());
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe from dialog result', () => {
      // given
      (component as any).dialogResultSubscription = new Subject();
      const spy = spyOn((component as any).dialogResultSubscription, 'unsubscribe');

      // when
      component.ngOnDestroy();

      // then
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not unsubsribe from dialog result if subscription is null', () => {
      // given
      (component as any).dialogResultSubscription = new Subject();
      const spy = spyOn((component as any).dialogResultSubscription, 'unsubscribe');
      (component as any).dialogResultSubscription = undefined;

      // when
      component.ngOnDestroy();

      // then
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('On View Changed', () => {
    it('should change view type  journey', () => {
      const adonaView: AdonaCalendarView = { view: CalendarView.Day, isList: false };
      component.onViewChanged(adonaView);
      expect(component.view).toBe(adonaView);

      adonaView.view = CalendarView.Week;
      component.onViewChanged(adonaView);
      expect(component.view).toBe(adonaView);

      adonaView.isList = true;
      component.onViewChanged(adonaView);
      expect(component.view).toBe(adonaView);

      adonaView.isList = false;
      adonaView.view = CalendarView.Month;
      component.onViewChanged(adonaView);
      expect(component.view).toBe(adonaView);
    });
  });

  describe('On View Date Changed', () => {
    it('should set view date and load events for this date', () => {
      // given
      component.viewDate = new Date();
      const newDate = new Date(2019, 1, 1);

      // when
      component.onViewDateChanged(newDate);

      // then
      expect(component.viewDate).toBe(newDate);
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledTimes(1);
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledWith(newDate);
    });
  });

  describe('Open New Event Dialog', () => {
    it('should open dialog and call addEvent if new event passed as a result', () => {
      // given
      const newEvent = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];

      dialog.open.and.returnValue({
        afterClosed: () => of(newEvent)
      } as any);

      // when
      component.openNewEventModal();

      // then
      expect(dialog.open).toHaveBeenCalledTimes(1);
      expect(dialog.open).toHaveBeenCalledWith(NewEventDialogComponent, { width: '400px' });
      expect(calendarFacade.addEvent).toHaveBeenCalledTimes(1);
      expect(calendarFacade.addEvent).toHaveBeenCalledWith(newEvent);
    });

    it('should open dialog and and do nothing if new event is not passed as a result', () => {
      // given
      dialog.open.and.returnValue({
        afterClosed: () => of(null)
      } as any);

      // when
      component.openNewEventModal();

      // then
      expect(dialog.open).toHaveBeenCalledTimes(1);
      expect(dialog.open).toHaveBeenCalledWith(NewEventDialogComponent, { width: '400px' });
      expect(calendarFacade.addEvent).not.toHaveBeenCalled();
    });
  });
});
