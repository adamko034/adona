import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CalendarView } from 'angular-calendar';
import { hot } from 'jasmine-marbles';
import { AdonaCalendarView } from '../model/adona-calendar-view.model';
import { EventsTestDataBuilder } from '../utils/tests/event-test-data.builder';
import { fromCalendarEvents, toCalendarEvents } from '../utils/tests/mappers-test-functions';
import {
  CalendarViewChangedAction,
  CalendarViewDateChangedAction,
  EventDeleteRequestedAction,
  MonthEventsRequestedAction,
  NewEventRequestedAction,
  UpdateEventRequestedAction
} from './actions/calendar.actions';
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

    mockStore = TestBed.get<Store<CalendarState>>(Store);
    facade = new CalendarFacade(mockStore, mapper);

    dispatchSpy = spyOn(mockStore, 'dispatch');
  });

  describe('Load Month Events method', () => {
    it('should dispatch Month Events Requested Action', () => {
      // given
      const date = new Date();

      // when
      facade.loadMonthEvents(date);

      // then
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new MonthEventsRequestedAction({ date }));
    });
  });

  describe('Update Event method', () => {
    it('should dispatch Update Event Requested Action', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];

      // when
      facade.updateEvent(event);

      // then
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new UpdateEventRequestedAction({ event }));
    });
  });

  describe('Add Event method', () => {
    it('should dispatch New Event Requested Action', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];

      // when
      facade.addEvent(event);

      // then
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new NewEventRequestedAction({ newEvent: event }));
    });
  });

  describe('Delete Event method', () => {
    it('should dispatch Event Delete Requested Action', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];

      // when
      facade.deleteEvent(event);

      // then
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new EventDeleteRequestedAction({ id: event.id }));
    });
  });

  describe('Get Months Loaded method', () => {
    it('should return months loaded', () => {
      // given
      const months = ['201901', '201902', '201812'];
      mockStore.overrideSelector(calendarQueries.selectMonthsLoaded, months);
      const expected = hot('b', { b: months });

      // when
      const result = facade.getMonthsLoaded();

      // then
      expect(result).toBeObservable(expected);
    });
  });

  describe('Events$ property', () => {
    it('should return events', () => {
      // given
      const events = new EventsTestDataBuilder()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildEvents();
      mockStore.overrideSelector(calendarQueries.selectEvents, events);
      const expected = hot('b', { b: toCalendarEvents(events) });

      // when
      const result = facade.events$;

      // then
      expect(result).toBeObservable(expected);
    });
  });

  describe('Change View', () => {
    it('should dispatch View Changed Action', () => {
      // given
      const newView: AdonaCalendarView = { isList: true, calendarView: CalendarView.Month };

      // when
      facade.changeView(newView);

      // then
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new CalendarViewChangedAction({ newView }));
    });
  });

  describe('Change View Date', () => {
    it('should dispatch View Date Changed Action', () => {
      // given
      const newDate = new Date(2020, 1, 20);

      // when
      facade.changeViewDate(newDate);

      // then
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new CalendarViewDateChangedAction({ newDate }));
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
      const result = facade.getView();

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
      const result = facade.getViewDate();

      // then
      expect(result).toBeObservable(expected);
    });
  });
});
