import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CalendarView } from 'angular-calendar';
import { hot } from 'jasmine-marbles';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { DateTestBuilder } from 'src/app/utils/testUtils/builders/date-test.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';
import { AdonaCalendarView } from '../model/adona-calendar-view.model';
import { EventsTestDataBuilder } from '../utils/tests/event-test-data.builder';
import { fromCalendarEvents, toCalendarEvents } from '../utils/tests/mappers-test-functions';
import { CalendarFacade } from './calendar.facade';
import { CalendarState } from './reducers/calendar.reducer';
import { calendarQueries } from './selectors/calendar.selectors';

describe('Calendar Facade', () => {
  let mockStore: MockStore<CalendarState>;
  const mapper: any = {
    CalendarEvent: {
      fromEvents: fromCalendarEvents
    }
  };

  let dispatchSpy;
  let facade: CalendarFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    mockStore = TestBed.inject(MockStore);
    facade = new CalendarFacade(mockStore, mapper);

    dispatchSpy = spyOn(mockStore, 'dispatch');
  });

  describe('Load Month Events method', () => {
    it('should dispatch Month Events Requested Action', () => {
      // given
      const date = new Date();

      // when
      facade.loadMonthEvents(date);

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        dispatchSpy,
        1,
        calendarActions.events.loadMonthEventsRequest({ date })
      );
    });
  });

  describe('Update Event method', () => {
    it('should dispatch Update Event Requested Action', () => {
      // given
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];

      // when
      facade.updateEvent(event);

      // then
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(calendarActions.event.updateEventRequest({ event }));
    });
  });

  describe('Add Event method', () => {
    it('should dispatch New Event Requested Action', () => {
      // given
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];

      // when
      facade.addEvent(event);

      // then
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(calendarActions.event.addEventRequest({ event }));
    });
  });

  describe('Delete Event method', () => {
    it('should dispatch Event Delete Requested Action', () => {
      // given
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];

      // when
      facade.deleteEvent(event);

      // then
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(calendarActions.event.deleteEventRequest({ id: event.id }));
    });
  });

  describe('Get Months Loaded method', () => {
    it('should return months loaded', () => {
      const months = [
        DateTestBuilder.now().addMonth(-1).build(),
        DateTestBuilder.now().addMonth(-2).build(),
        DateTestBuilder.now().addMonth(-3).build()
      ];
      mockStore.overrideSelector(calendarQueries.selectMonthsLoaded, months);
      const expected = hot('b', { b: months });

      const result = facade.selectMonthsLoaded();

      expect(result).toBeObservable(expected);
    });
  });

  describe('Select Events', () => {
    it('should return events', () => {
      // given
      const events = EventsTestDataBuilder.from()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildEvents();
      mockStore.overrideSelector(calendarQueries.selectEvents, events);
      const expected = hot('b', { b: toCalendarEvents(events) });

      // when
      const result = facade.selectEvents();

      // then
      expect(result).toBeObservable(expected);
    });
  });

  describe('Change View', () => {
    it('should dispatch View Changed Action', () => {
      const newView: AdonaCalendarView = { isList: true, calendarView: CalendarView.Month };

      facade.changeView(newView);

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dispatchSpy, 1, calendarActions.ui.viewChange({ view: newView }));
    });
  });

  describe('Change View Date', () => {
    it('should dispatch View Date Changed Action', () => {
      const newDate = new Date(2020, 1, 20);

      facade.changeViewDate(newDate);

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        dispatchSpy,
        1,
        calendarActions.ui.viewDateChange({ date: newDate })
      );
    });
  });

  describe('Get View', () => {
    it('should return observable of view', () => {
      // given
      const view: AdonaCalendarView = {
        isList: false,
        calendarView: CalendarView.Week
      };
      mockStore.overrideSelector(calendarQueries.selectView, view);
      const expected = hot('b', { b: view });

      // when
      const result = facade.selectView();

      // then
      expect(result).toBeObservable(expected);
    });
  });

  describe('Get View Date', () => {
    it('should return observable of date', () => {
      // given
      const newDate = new Date(2020, 1, 22);
      mockStore.overrideSelector(calendarQueries.selectViewDate, newDate);
      const expected = hot('b', { b: newDate });

      // when
      const result = facade.selectViewDate();

      // then
      expect(result).toBeObservable(expected);
    });
  });
});
