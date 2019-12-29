import { CalendarView } from 'angular-calendar';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of, Subject } from 'rxjs';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view.model';
import { TimeExtractionService } from 'src/app/shared/services/time/parts/time-extraction.service';
import { DialogAction } from '../../../../shared/enum/dialog-action.enum';
import { DialogResult } from '../../../../shared/models/dialog-result.model';
import { TimeComparisonService } from '../../../../shared/services/time/parts/time-comparison.service';
import { NewEventDialogComponent } from '../../components/dialogs/new-event-dialog/new-event-dialog.component';
import { CalendarEventDialogService } from '../../service/calendar-event-dialog.service';
import { CalendarFacade } from '../../store/calendar.facade';
import { DialogResultTestDataBuilder } from '../../utils/tests/dialog-result-test-data.builder';
import { EventsTestDataBuilder } from '../../utils/tests/event-test-data.builder';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  const calendarFacade = jasmine.createSpyObj<CalendarFacade>('CalendarFacade', [
    'loadMonthEvents',
    'addEvent',
    'updateEvent',
    'deleteEvent'
  ]);
  const dialogService = jasmine.createSpyObj<CalendarEventDialogService>('DialogService', ['open']);
  const deviceService = jasmine.createSpyObj<DeviceDetectorService>('DeviceService', ['isMobile']);
  const timeService: any = {
    Extraction: jasmine.createSpyObj<TimeExtractionService>('TimeExtractionService', [
      'getPreviousMonthOf',
      'getNextMonthOf',
      'getStartOfWeek',
      'getEndOfWeek'
    ]),
    Comparison: jasmine.createSpyObj<TimeComparisonService>('TimeComparisonService', ['areDatesInTheSameMonth'])
  };

  beforeEach(() => {
    component = new CalendarComponent(calendarFacade, timeService, deviceService, dialogService);

    calendarFacade.loadMonthEvents.calls.reset();
    calendarFacade.addEvent.calls.reset();
    calendarFacade.updateEvent.calls.reset();
    calendarFacade.deleteEvent.calls.reset();
    dialogService.open.calls.reset();
  });

  describe('On Init', () => {
    it('should call for events for this and previous month', () => {
      // given
      const viewDate = new Date(2019, 10, 10);
      const previousMonth = new Date(2019, 9, 10);
      const nextMonth = new Date(2019, 11, 10);

      component.viewDate = viewDate;
      timeService.Extraction.getPreviousMonthOf.and.returnValue(previousMonth);
      timeService.Extraction.getNextMonthOf.and.returnValue(nextMonth);

      // when
      component.ngOnInit();

      // then
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledTimes(3);
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledWith(viewDate);
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledWith(previousMonth);
    });

    it('should default to month view on non mobile device', () => {
      // given
      deviceService.isMobile.and.returnValue(false);

      // when
      component.ngOnInit();

      // then
      expect(component.view).toEqual({ view: CalendarView.Month, isList: false });
      expect(component.viewDate.toDateString()).toEqual(new Date().toDateString());
    });

    it('should default to list view on mobile device', () => {
      // given
      deviceService.isMobile.and.returnValue(true);

      // when
      component.ngOnInit();

      // then
      expect(component.view).toEqual({ view: CalendarView.Month, isList: true });
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
    it('should change view type journey', () => {
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

    describe('adjuest fetch date for week view', () => {
      beforeEach(() => {
        timeService.Extraction.getStartOfWeek.calls.reset();
        timeService.Extraction.getEndOfWeek.calls.reset();
        timeService.Comparison.areDatesInTheSameMonth.calls.reset();
      });

      it('should load for previous month', () => {
        // given
        const currentViewDate = new Date(2019, 10, 8);
        component.view = { isList: false, view: CalendarView.Week };
        component.viewDate = currentViewDate;
        const newDate = new Date(2019, 10, 1);
        const fetchDate = new Date(2019, 9, 28);

        const startOfWeek = new Date(2019, 9, 28);
        const endOfWeek = new Date(2019, 10, 3);

        timeService.Extraction.getStartOfWeek.and.returnValue(startOfWeek);
        timeService.Extraction.getEndOfWeek.and.returnValue(endOfWeek);

        timeService.Comparison.areDatesInTheSameMonth
          .withArgs(currentViewDate, startOfWeek)
          .and.returnValue(false)
          .withArgs(currentViewDate, endOfWeek)
          .and.returnValue(true);

        // when
        component.onViewDateChanged(newDate);

        // then
        expect(component.viewDate).toBe(newDate);
        expect(calendarFacade.loadMonthEvents).toHaveBeenCalledTimes(1);
        expect(calendarFacade.loadMonthEvents).toHaveBeenCalledWith(fetchDate);
      });

      it('should load for next month', () => {
        // given
        const currentViewDate = new Date(2020, 0, 23);
        component.view = { isList: false, view: CalendarView.Week };
        component.viewDate = currentViewDate;
        const newDate = new Date(2020, 0, 30);
        const fetchDate = new Date(2020, 1, 2);

        const startOfWeek = new Date(2020, 0, 27);
        const endOfWeek = new Date(2020, 1, 2);

        timeService.Extraction.getStartOfWeek.and.returnValue(startOfWeek);
        timeService.Extraction.getEndOfWeek.and.returnValue(endOfWeek);

        timeService.Comparison.areDatesInTheSameMonth
          .withArgs(currentViewDate, startOfWeek)
          .and.returnValue(true)
          .withArgs(currentViewDate, endOfWeek)
          .and.returnValue(false);

        // when
        component.onViewDateChanged(newDate);

        // then
        expect(component.viewDate).toBe(newDate);
        expect(calendarFacade.loadMonthEvents).toHaveBeenCalledTimes(1);
        expect(calendarFacade.loadMonthEvents).toHaveBeenCalledWith(fetchDate);
      });
    });
  });

  describe('On Event Clicked', () => {
    it('should open dialog and add new event', () => {
      // given
      const newEvent = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];
      const dialogResult: DialogResult = DialogResultTestDataBuilder.init()
        .withAction(DialogAction.SaveAdd)
        .withPayload(newEvent)
        .build();

      dialogService.open.and.returnValue(of(dialogResult));

      // when
      component.onEventClicked();

      // then
      expect(dialogService.open).toHaveBeenCalledTimes(1);
      expect(dialogService.open).toHaveBeenCalledWith(NewEventDialogComponent, {
        width: '400px',
        data: { event: undefined }
      });
      expect(calendarFacade.addEvent).toHaveBeenCalledTimes(1);
      expect(calendarFacade.updateEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.deleteEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.addEvent).toHaveBeenCalledWith(newEvent);
    });

    it('should open dialog and do nothing if dialog was cancelled', () => {
      // given
      const dialogResult = DialogResultTestDataBuilder.init()
        .withAction(DialogAction.Cancel)
        .withPayload(null)
        .build();

      dialogService.open.and.returnValue(of(dialogResult));

      // when
      component.onEventClicked();

      // then
      expect(dialogService.open).toHaveBeenCalledTimes(1);
      expect(dialogService.open).toHaveBeenCalledWith(NewEventDialogComponent, {
        width: '400px',
        data: { event: undefined }
      });
      expect(calendarFacade.addEvent).not.toHaveBeenCalled();
      expect(calendarFacade.updateEvent).not.toHaveBeenCalled();
      expect(calendarFacade.deleteEvent).not.toHaveBeenCalled();
    });

    it('should open dialog to edit mode and update event', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];
      const updatedEvent = { ...event, title: 'new updated title' };
      const dialogResult: DialogResult = DialogResultTestDataBuilder.init()
        .withAction(DialogAction.SaveUpdate)
        .withPayload(updatedEvent)
        .build();

      dialogService.open.and.returnValue(of(dialogResult));

      // when
      component.onEventClicked(event);

      // then
      expect(dialogService.open).toHaveBeenCalledTimes(1);
      expect(dialogService.open).toHaveBeenCalledWith(NewEventDialogComponent, {
        width: '400px',
        data: { event }
      });
      expect(calendarFacade.addEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.updateEvent).toHaveBeenCalledTimes(1);
      expect(calendarFacade.deleteEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.updateEvent).toHaveBeenCalledWith(updatedEvent);
    });

    it('should open dialog to edit mode and delete event', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];
      const dialogResult: DialogResult = DialogResultTestDataBuilder.init()
        .withAction(DialogAction.Delete)
        .withPayload(event)
        .build();

      dialogService.open.and.returnValue(of(dialogResult));

      // when
      component.onEventClicked(event);

      // then
      expect(dialogService.open).toHaveBeenCalledTimes(1);
      expect(dialogService.open).toHaveBeenCalledWith(NewEventDialogComponent, {
        width: '400px',
        data: { event }
      });
      expect(calendarFacade.addEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.updateEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.deleteEvent).toHaveBeenCalledTimes(1);
      expect(calendarFacade.deleteEvent).toHaveBeenCalledWith(event);
    });
  });
});
