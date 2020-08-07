import { CalendarView } from 'angular-calendar';
import { of } from 'rxjs';
import { NewEventDialogData } from 'src/app/modules/calendar/components/dialogs/new-event-dialog/models/new-event-dialog-data.model';
import { NewEventDialogComponent } from 'src/app/modules/calendar/components/dialogs/new-event-dialog/new-event-dialog.component';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarComponent } from 'src/app/modules/calendar/pages/calendar/calendar.component';
import { DialogResultTestDataBuilder } from 'src/app/modules/calendar/utils/tests/dialog-result-test-data.builder';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';
import { DialogAction } from 'src/app/shared/enum/dialog-action.enum';
import { DialogResult } from 'src/app/shared/services/dialogs/dialog-result.model';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('CalendarComponent', () => {
  const mockDate = new Date();
  const user = UserTestBuilder.withDefaultData().build();
  let event: Event;
  let newEventDialogData: NewEventDialogData;

  let component: CalendarComponent;

  const {
    calendarFacade,
    dialogService,
    routerFacade,
    timeService,
    userFacade,
    unsubscriberService
  } = SpiesBuilder.init()
    .withRouterFacade()
    .withTimeService()
    .withCalendarFacade()
    .withDialogService()
    .withUserFacade()
    .withUnsubscriberService()
    .build();

  beforeAll(() => {
    jasmine.clock().mockDate(mockDate);
    jasmine.clock().install();

    event = EventsTestDataBuilder.from().addOneWithUserData(user).buildEvents()[0];
    newEventDialogData = {
      allDay: event.allDay,
      end: event.end,
      id: event.id,
      start: event.start,
      title: event.title
    };
  });

  beforeEach(() => {
    component = new CalendarComponent(
      calendarFacade,
      timeService,
      dialogService,
      userFacade,
      unsubscriberService,
      routerFacade
    );

    calendarFacade.loadMonthEvents.calls.reset();
    calendarFacade.addEvent.calls.reset();
    calendarFacade.updateEvent.calls.reset();
    calendarFacade.deleteEvent.calls.reset();
    calendarFacade.selectView.calls.reset();
    calendarFacade.selectViewDate.calls.reset();
    calendarFacade.changeView.calls.reset();
    calendarFacade.selectEvents.calls.reset();
    dialogService.open.calls.reset();
    routerFacade.selectCurrentRoute.calls.reset();

    calendarFacade.selectView.and.returnValue(of({ isList: false, calendarView: CalendarView.Month }));
    calendarFacade.selectViewDate.and.returnValue(of(new Date()));

    userFacade.selectUser.and.returnValue(of(user));
    component.user = user;
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  describe('On Init', () => {
    it('should read from store (view, view date, events for this, previous and next months)', () => {
      const viewDate = new Date(2019, 10, 10);
      const previousMonth = new Date(2019, 9, 10);
      const nextMonth = new Date(2019, 11, 10);

      component.viewDate = viewDate;
      calendarFacade.selectViewDate.and.returnValue(of(viewDate));
      timeService.Extraction.getPreviousMonthOf.and.returnValue(previousMonth);
      timeService.Extraction.getNextMonthOf.and.returnValue(nextMonth);
      routerFacade.selectCurrentRoute.and.returnValue(of('/calendar/month'));

      component.ngOnInit();

      expect(routerFacade.selectCurrentRoute).toHaveBeenCalledTimes(1);
      expect(calendarFacade.selectView).toHaveBeenCalledTimes(1);
      expect(calendarFacade.selectViewDate).toHaveBeenCalledTimes(1);
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledTimes(3);
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledWith(viewDate, component.user.selectedTeamId);
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledWith(previousMonth, component.user.selectedTeamId);
      expect(calendarFacade.loadMonthEvents).toHaveBeenCalledWith(nextMonth, component.user.selectedTeamId);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(calendarFacade.changeView, 1, {
        isList: false,
        calendarView: CalendarView.Month
      });
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(calendarFacade.selectEvents, 1, component.user.selectedTeamId);
    });
  });

  describe('On Destroy', () => {
    it('should complete subcriptions', () => {
      component.ngOnDestroy();

      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Event Clicked', () => {
    it('should open dialog and add new event', () => {
      const dialogResult: DialogResult<NewEventDialogData> = DialogResultTestDataBuilder.init<NewEventDialogData>()
        .withAction(DialogAction.SaveAdd)
        .withPayload(newEventDialogData)
        .build();

      dialogService.open.and.returnValue(of(dialogResult));

      component.onEventClicked();

      expect(dialogService.open).toHaveBeenCalledTimes(1);
      expect(dialogService.open).toHaveBeenCalledWith(NewEventDialogComponent, {
        data: null
      });
      expect(calendarFacade.addEvent).toHaveBeenCalledTimes(1);
      expect(calendarFacade.updateEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.deleteEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.addEvent).toHaveBeenCalledWith(event);
    });

    it('should open dialog and do nothing if dialog was cancelled', () => {
      const dialogResult = DialogResultTestDataBuilder.init().withAction(DialogAction.Cancel).withPayload(null).build();
      dialogService.open.and.returnValue(of(dialogResult));

      component.onEventClicked();

      expect(dialogService.open).toHaveBeenCalledTimes(1);
      expect(dialogService.open).toHaveBeenCalledWith(NewEventDialogComponent, {
        data: null
      });
      expect(calendarFacade.addEvent).not.toHaveBeenCalled();
      expect(calendarFacade.updateEvent).not.toHaveBeenCalled();
      expect(calendarFacade.deleteEvent).not.toHaveBeenCalled();
    });

    it('should open dialog to edit mode and update event', () => {
      const updatedEvent = { ...event, title: 'new updated title' };
      const updatedDialogData = { ...newEventDialogData, title: 'new updated title' };
      const dialogResult: DialogResult<NewEventDialogData> = DialogResultTestDataBuilder.init<NewEventDialogData>()
        .withAction(DialogAction.SaveUpdate)
        .withPayload(updatedDialogData)
        .build();

      dialogService.open.and.returnValue(of(dialogResult));

      component.onEventClicked(event);

      expect(dialogService.open).toHaveBeenCalledTimes(1);
      expect(dialogService.open).toHaveBeenCalledWith(NewEventDialogComponent, {
        data: newEventDialogData
      });
      expect(calendarFacade.addEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.updateEvent).toHaveBeenCalledTimes(1);
      expect(calendarFacade.deleteEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.updateEvent).toHaveBeenCalledWith(updatedEvent);
    });

    it('should open dialog to edit mode and delete event', () => {
      const dialogResult: DialogResult<NewEventDialogData> = DialogResultTestDataBuilder.init<NewEventDialogData>()
        .withAction(DialogAction.Delete)
        .withPayload(newEventDialogData)
        .build();
      dialogService.open.and.returnValue(of(dialogResult));

      component.onEventClicked(event);

      expect(dialogService.open).toHaveBeenCalledTimes(1);
      expect(dialogService.open).toHaveBeenCalledWith(NewEventDialogComponent, {
        data: newEventDialogData
      });
      expect(calendarFacade.addEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.updateEvent).toHaveBeenCalledTimes(0);
      expect(calendarFacade.deleteEvent).toHaveBeenCalledTimes(1);
      expect(calendarFacade.deleteEvent).toHaveBeenCalledWith(event);
    });
  });
});
