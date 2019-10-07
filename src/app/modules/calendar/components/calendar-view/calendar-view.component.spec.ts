import * as moment from 'moment';
import { of, Subject } from 'rxjs';
import { TimeComparisonService } from 'src/app/shared/services/time/parts/time-comparison.service';
import { Event } from '../../model/event.model';
import { CalendarFacade } from '../../store/calendar.facade';
import { EventsTestDataBuilder } from '../../utils/tests/event-test-data.builder';
import { NewEventDialogComponent } from '../dialogs/new-event-dialog/new-event-dialog.component';
import { CalendarViewComponent } from './calendar-view.component';

describe('CalendarViewComponent', () => {
  const currentViewDate = new Date(2019, 10, 5);
  const events = new EventsTestDataBuilder()
    .addOneWithDefaultData()
    .addOneWithDefaultData()
    .buildEvent();

  let component: CalendarViewComponent;

  const timeService: any = {
    Comparison: jasmine.createSpyObj<TimeComparisonService>('TimeComparisonService', [
      'isDateBetweenDates',
      'areInTheSameMonth',
      'areDatesTheSame'
    ])
  };
  const matDialog: any = jasmine.createSpyObj('MatDialog', ['open']);
  const facade = jasmine.createSpyObj<CalendarFacade>('CalendarFacade', ['updateEvent']);

  beforeEach(() => {
    component = new CalendarViewComponent(timeService, matDialog, facade);
    component.viewDate = currentViewDate;

    timeService.Comparison.areInTheSameMonth.calls.reset();
    timeService.Comparison.areDatesTheSame.calls.reset();
    timeService.Comparison.areInTheSameMonth.and.returnValue(true);

    matDialog.open.and.returnValue({ afterClosed: () => of(null) } as any);
    matDialog.open.calls.reset();

    facade.updateEvent.calls.reset();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  describe('Date Changed event', () => {
    it('should not change view date and active day when when new date in different month', () => {
      // given
      const currentDate = new Date(2019, 5, 1);
      const newDate = new Date(2019, 6, 1);

      timeService.Comparison.areInTheSameMonth.and.returnValue(false);

      // when
      component.activeDayIsOpen = true;
      component.viewDate = currentDate;
      component.dayClicked({ date: newDate, events: [] });

      // then
      expect(component.activeDayIsOpen).toBeTruthy();
      expect(timeService.Comparison.areInTheSameMonth).toHaveBeenCalledTimes(1);
      expect(timeService.Comparison.areInTheSameMonth).toHaveBeenCalledWith(currentDate, newDate);
    });

    describe('New date in the same month', () => {
      describe('No events in new date', () => {
        [true, false].forEach((value: boolean) => {
          it(`shold disable active day when previous value is: ${value.toString()}`, () => {
            // given
            const newDate = moment(currentViewDate)
              .add(1, 'days')
              .toDate();
            component.activeDayIsOpen = value;
            timeService.Comparison.areDatesTheSame.and.returnValue(false);

            // when
            component.dayClicked({ date: newDate, events: [] });

            // then
            expect(component.activeDayIsOpen).toBeFalsy();
          });
        });
      });

      describe('The same date', () => {
        [true, false].forEach((currentValue: boolean) => {
          it(`should toggle active day, current value: ${currentValue.toString()}`, () => {
            // given
            component.activeDayIsOpen = currentValue;
            timeService.Comparison.areDatesTheSame.and.returnValue(true);

            // when
            component.dayClicked({ date: currentViewDate, events });

            // then
            expect(component.activeDayIsOpen).toBe(!currentValue);
          });
        });
      });
    });
  });

  describe('Event clicked', () => {
    it('should open dialog', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildCalendarEvents()[0];

      // when
      component.eventClicked(event);

      // then
      expect(matDialog.open).toHaveBeenCalledTimes(1);
      expect(matDialog.open).toHaveBeenCalledWith(NewEventDialogComponent, { width: '400px', data: { event } });
      expect(facade.updateEvent).toHaveBeenCalledTimes(0);
    });

    it('should update event', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildCalendarEvents()[0];
      const updatedEvent: Event = {
        id: event.id.toString(),
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        title: 'new title'
      };

      matDialog.open.and.returnValue({ afterClosed: () => of(updatedEvent) });

      // when
      component.eventClicked(event);

      // then
      expect(matDialog.open).toHaveBeenCalledTimes(1);
      expect(matDialog.open).toHaveBeenCalledWith(NewEventDialogComponent, { width: '400px', data: { event } });
      expect(facade.updateEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Component Destroy', () => {
    it('should unsubscribe', () => {
      // given
      (component as any).dialogResultSubscription = new Subject();
      const subsribtionSpy = spyOn((component as any).dialogResultSubscription, 'unsubscribe');

      // when
      component.ngOnDestroy();

      // then
      expect(subsribtionSpy).toHaveBeenCalledTimes(1);
    });

    it('should not unsubscribe if subscription is null', () => {
      // given
      (component as any).dialogResultSubscription = new Subject();
      const subsribtionSpy = spyOn((component as any).dialogResultSubscription, 'unsubscribe');
      (component as any).dialogResultSubscription = undefined;

      // when
      component.ngOnDestroy();

      // then
      expect(subsribtionSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('Setting Is Active Day', () => {
    it('default to false', () => {
      expect(component.activeDayIsOpen).toBeFalsy();
    });

    it('should set to false if event does not exists on this day', () => {
      // given
      component.viewDate = moment()
        .add('1', 'weeks')
        .toDate();
      component.events = events;

      // when
      component.ngOnChanges();

      // then
      expect(component.activeDayIsOpen).toBeFalsy();
    });

    it('should set to true if event exists on this day', () => {
      // given
      component.viewDate = moment().toDate();
      component.events = new EventsTestDataBuilder()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildCalendarEvents();

      // when
      component.ngOnChanges();

      // then
      expect(component.activeDayIsOpen).toBeTruthy();
    });

    it('should set to true if all days event exists on this day', () => {
      // given
      component.viewDate = moment()
        .add('5', 'days')
        .toDate();

      const calendarEvents = new EventsTestDataBuilder()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildCalendarEvents();
      calendarEvents[0].start = moment()
        .add('3', 'days')
        .toDate();
      calendarEvents[0].end = moment()
        .add('6', 'days')
        .toDate();

      component.events = calendarEvents;

      // when
      component.ngOnChanges();

      // then
      expect(component.activeDayIsOpen).toBeTruthy();
    });
  });
});
