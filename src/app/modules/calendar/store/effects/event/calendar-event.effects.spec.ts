import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { CalendarEventEffects } from 'src/app/modules/calendar/store/effects/event/calendar-event.effects';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Calendar Event Effects', () => {
  let effects: CalendarEventEffects;
  let actions$: Actions;

  const {
    errorEffectService,
    calendarService
  } = SpiesBuilder.init().withErrorEffectService().withCalendarService().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$)]
    });

    actions$ = TestBed.inject(Actions);
    effects = new CalendarEventEffects(actions$, calendarService, errorEffectService);
  });

  it('should create failure effects', () => {
    errorEffectService.createFrom.calls.reset();

    effects = new CalendarEventEffects(actions$, calendarService, errorEffectService);

    expect(errorEffectService.createFrom).toHaveBeenCalledTimes(3);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(actions$, calendarActions.event.addEventFailure);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(actions$, calendarActions.event.updateEventFailure);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(actions$, calendarActions.event.deleteEventFailure);
  });

  describe('New Event Requested effect', () => {
    beforeEach(() => {
      calendarService.addEvent.calls.reset();
    });

    it('should add event and map to Add Event Success action', () => {
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];

      calendarService.addEvent.and.returnValue(cold('a', { a: event }));

      actions$ = hot('-a--a', { a: calendarActions.event.addEventRequest({ event }) });
      const expected = cold('-b--b', { b: calendarActions.event.addEventSuccess({ event }) });

      expect(effects.addEventRequest$).toBeObservable(expected);
      expect(calendarService.addEvent).toHaveBeenCalledTimes(2);
      expect(calendarService.addEvent).toHaveBeenCalledWith(event);
    });

    it('should map to Add Event Failure action if service fails', () => {
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];

      actions$ = hot('-a--a', { a: calendarActions.event.addEventRequest({ event }) });
      calendarService.addEvent.and.returnValue(cold('#', null, { test: 500 }));

      const expected = cold('-b--b', {
        b: calendarActions.event.addEventFailure({ error: ErrorBuilder.from().withErrorObject({ test: 500 }).build() })
      });

      expect(effects.addEventRequest$).toBeObservable(expected);
      expect(calendarService.addEvent).toHaveBeenCalledTimes(2);
      expect(calendarService.addEvent).toHaveBeenCalledWith(event);
    });
  });

  describe('Update Event Request effect', () => {
    beforeEach(() => {
      calendarService.updateEvent.calls.reset();
    });

    it('should call service and return Update Event Success action', () => {
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];
      const eventUpdate = { id: event.id, changes: event };

      calendarService.updateEvent.and.returnValue(cold('b', { b: event }));

      actions$ = hot('-a--a', { a: calendarActions.event.updateEventRequest({ event }) });
      const expected = cold('-b--b', { b: calendarActions.event.updateEventSuccess({ eventUpdate }) });

      expect(effects.updateEventRequest$).toBeObservable(expected);
      expect(calendarService.updateEvent).toHaveBeenCalledTimes(2);
      expect(calendarService.updateEvent).toHaveBeenCalledWith(event);
    });

    it('should map to Update Event Failure when service fails', () => {
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];

      calendarService.updateEvent.and.returnValue(cold('#', null, { test: 500 }));

      actions$ = hot('-a--a', { a: calendarActions.event.updateEventRequest({ event }) });
      const expected = cold('-b--b', {
        b: calendarActions.event.updateEventFailure({
          error: ErrorBuilder.from().withErrorObject({ test: 500 }).build()
        })
      });

      expect(effects.updateEventRequest$).toBeObservable(expected);
      expect(calendarService.updateEvent).toHaveBeenCalledTimes(2);
      expect(calendarService.updateEvent).toHaveBeenCalledWith(event);
    });
  });

  describe('Delete Event Request effect', () => {
    beforeEach(() => {
      calendarService.deleteEvent.calls.reset();
    });

    it('should call service and map to Delete Event Success action', () => {
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];

      actions$ = hot('--a-a', { a: calendarActions.event.deleteEventRequest({ event }) });
      calendarService.deleteEvent.and.returnValue(cold('a', { a: null }));

      expect(effects.deleteEventRequest$).toBeObservable(
        cold('--a-a', { a: calendarActions.event.deleteEventSuccess({ id: event.id, teamId: event.teamId }) })
      );
      expect(calendarService.deleteEvent).toHaveBeenCalledTimes(2);
      expect(calendarService.deleteEvent).toHaveBeenCalledWith(event.id);
    });

    it('should map to Event Delete Error action ', () => {
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];
      calendarService.deleteEvent.and.returnValue(cold('#', null, { test: 500 }));

      actions$ = hot('--a---a', { a: calendarActions.event.deleteEventRequest({ event }) });

      expect(effects.deleteEventRequest$).toBeObservable(
        cold('--a---a', {
          a: calendarActions.event.deleteEventFailure({
            error: ErrorBuilder.from().withErrorObject({ test: 500 }).build()
          })
        })
      );
      expect(calendarService.deleteEvent).toHaveBeenCalledTimes(2);
      expect(calendarService.deleteEvent).toHaveBeenCalledWith(event.id);
    });
  });
});
