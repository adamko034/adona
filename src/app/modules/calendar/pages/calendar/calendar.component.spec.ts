import { CalendarView } from 'angular-calendar';
import { of, Subject } from 'rxjs';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { DialogAction } from '../../../../shared/enum/dialog-action.enum';
import { DialogResult } from '../../../../shared/services/dialogs/dialog-result.model';
import { NewEventDialogComponent } from '../../components/dialogs/new-event-dialog/new-event-dialog.component';
import { Event } from '../../model/event.model';
import { DialogResultTestDataBuilder } from '../../utils/tests/dialog-result-test-data.builder';
import { EventsTestDataBuilder } from '../../utils/tests/event-test-data.builder';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  const user = UserTestBuilder.withDefaultData().build();
  let component: CalendarComponent;

  const { calendarFacade, dialogService, deviceDetectorService, timeService, userFacade } = SpiesBuilder.init()
    .withDeviceDetectorService()
    .withTimeService()
    .withCalendarFacade()
    .withDialogService()
    .withUserFacade()
    .build();

  beforeEach(() => {
    component = new CalendarComponent(calendarFacade, timeService, deviceDetectorService, dialogService, userFacade);

    calendarFacade.loadMonthEvents.calls.reset();
    calendarFacade.addEvent.calls.reset();
    calendarFacade.updateEvent.calls.reset();
    calendarFacade.deleteEvent.calls.reset();
    calendarFacade.selectView.calls.reset();
    calendarFacade.selectViewDate.calls.reset();
    calendarFacade.changeView.calls.reset();
    dialogService.open.calls.reset();

    calendarFacade.selectView.and.returnValue(of({ isList: false, calendarView: CalendarView.Month }));
    calendarFacade.selectViewDate.and.returnValue(of(new Date()));

    userFacade.selectUser.and.returnValue(of(user));
  });

  describe('On Init', () => {
    it('should read from store (view, view date, events for this, previous and next months)', () => {
      // given
      const viewDate = new Date(2019, 10, 10);
      const previousMonth = new Date(2019, 9, 10);
      const nextMonth = new Date(2019, 11, 10);

      component.viewDate = viewDate;
      calendarFacade.selectViewDate.and.returnValue(of(viewDate));
      timeService.Extraction.getPreviousMonthOf.and.returnValue(previousMonth);
      timeService.Extraction.getNextMonthOf.and.returnValue(nextMonth);

      // when
      component.ngOnInit();

      // then
      expect(calendarFacade.selectView).toHaveBeenCalledTimes(1);
      expect(calendarFacade.selectViewDate).toHaveBeenCalledTimes(1);
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledTimes(3);
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledWith(viewDate);
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledWith(previousMonth);
    });

    it('should default to month view on non mobile device', () => {
      // given
      deviceDetectorService.isMobile.and.returnValue(false);

      // when
      component.ngOnInit();

      // then
      expect(calendarFacade.changeView).toHaveBeenCalledTimes(1);
      expect(calendarFacade.changeView).toHaveBeenCalledWith({ isList: false, calendarView: CalendarView.Month });
    });

    it('should default to list view on mobile device', () => {
      // given
      deviceDetectorService.isMobile.and.returnValue(true);

      // when
      component.ngOnInit();

      // then
      expect(calendarFacade.changeView).toHaveBeenCalledTimes(1);
      expect(calendarFacade.changeView).toHaveBeenCalledWith({ isList: true, calendarView: CalendarView.Month });
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

    it('should unsubscribe from view subscirption', () => {
      // given
      (component as any).viewSubscription = new Subject();
      const spy = spyOn((component as any).viewSubscription, 'unsubscribe');

      // when
      component.ngOnDestroy();

      // then
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not unsubsribe from view subscription if subscription is null', () => {
      // given
      (component as any).viewSubscription = new Subject();
      const spy = spyOn((component as any).viewSubscription, 'unsubscribe');
      (component as any).viewSubscription = undefined;

      // when
      component.ngOnDestroy();

      // then
      expect(spy).not.toHaveBeenCalled();
    });

    it('should unsubscribe from view date subsciption', () => {
      // given
      (component as any).viewDateSubsciption = new Subject();
      const spy = spyOn((component as any).viewDateSubsciption, 'unsubscribe');

      // when
      component.ngOnDestroy();

      // then
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not unsubsribe from view date subsciption if subscription is null', () => {
      // given
      (component as any).viewDateSubsciption = new Subject();
      const spy = spyOn((component as any).viewDateSubsciption, 'unsubscribe');
      (component as any).viewDateSubsciption = undefined;

      // when
      component.ngOnDestroy();

      // then
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('On Event Clicked', () => {
    it('should open dialog and add new event', () => {
      // given
      const newEvent = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];
      const dialogResult: DialogResult<Event> = DialogResultTestDataBuilder.init()
        .withAction(DialogAction.SaveAdd)
        .withPayload(newEvent)
        .build();

      dialogService.open.and.returnValue(of(dialogResult));

      // when
      component.onEventClicked();

      // then
      expect(dialogService.open).toHaveBeenCalledTimes(1);
      expect(dialogService.open).toHaveBeenCalledWith(NewEventDialogComponent, {
        data: undefined
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
        data: undefined
      });
      expect(calendarFacade.addEvent).not.toHaveBeenCalled();
      expect(calendarFacade.updateEvent).not.toHaveBeenCalled();
      expect(calendarFacade.deleteEvent).not.toHaveBeenCalled();
    });

    it('should open dialog to edit mode and update event', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];
      const updatedEvent = { ...event, title: 'new updated title' };
      const dialogResult: DialogResult<Event> = DialogResultTestDataBuilder.init()
        .withAction(DialogAction.SaveUpdate)
        .withPayload(updatedEvent)
        .build();

      dialogService.open.and.returnValue(of(dialogResult));

      // when
      component.onEventClicked(event);

      // then
      expect(dialogService.open).toHaveBeenCalledTimes(1);
      expect(dialogService.open).toHaveBeenCalledWith(NewEventDialogComponent, {
        data: event
      });
      expect(calendarFacade.addEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.updateEvent).toHaveBeenCalledTimes(1);
      expect(calendarFacade.deleteEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.updateEvent).toHaveBeenCalledWith(updatedEvent);
    });

    it('should open dialog to edit mode and delete event', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];
      const dialogResult: DialogResult<Event> = DialogResultTestDataBuilder.init()
        .withAction(DialogAction.Delete)
        .withPayload(event)
        .build();

      dialogService.open.and.returnValue(of(dialogResult));

      // when
      component.onEventClicked(event);

      // then
      expect(dialogService.open).toHaveBeenCalledTimes(1);
      expect(dialogService.open).toHaveBeenCalledWith(NewEventDialogComponent, {
        data: event
      });
      expect(calendarFacade.addEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.updateEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.deleteEvent).toHaveBeenCalledTimes(1);
      expect(calendarFacade.deleteEvent).toHaveBeenCalledWith(event);
    });
  });
});
