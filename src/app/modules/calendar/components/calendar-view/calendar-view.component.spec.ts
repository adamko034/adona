import * as moment from 'moment';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { CalendarFacade } from '../../store/calendar.facade';
import { EventsTestDataBuilder } from '../../utils/tests/event-test-data.builder';
import { CalendarViewComponent } from './calendar-view.component';

describe('Calendar View Component', () => {
  const currentViewDate = new Date(2019, 10, 5);
  const events = EventsTestDataBuilder.from().addOneWithDefaultData().addOneWithDefaultData().buildEvents();

  let component: CalendarViewComponent;

  const timeService = new TimeService();
  const facade = jasmine.createSpyObj<CalendarFacade>('calendarFacade', ['changeViewDate']);

  beforeEach(() => {
    component = new CalendarViewComponent(timeService, facade);
    component.viewDate = currentViewDate;

    facade.changeViewDate.calls.reset();
  });

  describe('Day Clicked', () => {
    it('should fetch new events when new date is on different month', () => {
      // given
      const currentDate = new Date(2019, 5, 1);
      const newDate = new Date(2019, 6, 1);

      // when
      component.activeDayIsOpen = true;
      component.viewDate = currentDate;
      component.dayClicked({ date: newDate, events: [] });

      // then
      expect(component.activeDayIsOpen).toBeTruthy();
      expect(component.viewDate).toEqual(currentDate);
      expect(facade.changeViewDate).toHaveBeenCalledTimes(1);
      expect(facade.changeViewDate).toHaveBeenCalledWith(newDate);
    });

    describe('New date in the same month', () => {
      describe('No events in new date', () => {
        [true, false].forEach((value: boolean) => {
          it(`shold disable active day when previous value is: ${value.toString()}`, () => {
            // given
            const newDate = moment(currentViewDate).add(1, 'days').toDate();
            component.activeDayIsOpen = value;

            // when
            component.dayClicked({ date: newDate, events: [] });

            // then
            expect(component.activeDayIsOpen).toBeFalsy();
            expect(facade.changeViewDate).toHaveBeenCalledTimes(1);
            expect(facade.changeViewDate).toHaveBeenCalledWith(newDate);
          });
        });
      });

      describe('The same date', () => {
        [true, false].forEach((currentValue: boolean) => {
          it(`should toggle active day, current value: ${currentValue.toString()} and should not change view date`, () => {
            // given
            component.activeDayIsOpen = currentValue;

            // when
            component.dayClicked({ date: currentViewDate, events });

            // then
            expect(component.activeDayIsOpen).toEqual(!currentValue);
            expect(facade.changeViewDate).toHaveBeenCalledTimes(0);
          });
        });
      });
    });
  });

  describe('Event clicked', () => {
    it('should emit event', () => {
      // given
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildCalendarEvents()[0];
      const spy = spyOn(component.eventClicked, 'emit');

      // when
      component.onEventClicked(event);

      // then
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(event);
    });
  });

  describe('Setting Is Active Day', () => {
    it('default to false', () => {
      expect(component.activeDayIsOpen).toBeFalsy();
    });

    it('should set to false if event does not exists on this day', () => {
      // given
      component.viewDate = moment().add('1', 'weeks').toDate();
      component.events = events;

      // when
      component.ngOnChanges();

      // then
      expect(component.activeDayIsOpen).toBeFalsy();
    });

    it('should set to true if event exists on this day', () => {
      // given
      component.viewDate = moment().toDate();
      component.events = EventsTestDataBuilder.from()
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
      component.viewDate = moment().add('5', 'days').toDate();

      const calendarEvents = EventsTestDataBuilder.from()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildCalendarEvents();
      calendarEvents[0].start = moment().add('3', 'days').toDate();
      calendarEvents[0].end = moment().add('6', 'days').toDate();

      component.events = calendarEvents;

      // when
      component.ngOnChanges();

      // then
      expect(component.activeDayIsOpen).toBeTruthy();
    });
  });

  describe('Ng On Changes', () => {
    it('should recalculate if active day is open', () => {
      // given
      const spy = spyOn(component as any, 'eventExistsOnViewDate');

      // when
      component.ngOnChanges();

      // then
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
