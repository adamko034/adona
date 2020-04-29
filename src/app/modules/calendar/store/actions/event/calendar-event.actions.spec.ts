import { Update } from '@ngrx/entity';
import { ErrorTestDataBuilder } from 'src/app/core/error/utils/test/error-test-data.builder';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';

describe('Calendar Event Actions', () => {
  const error = ErrorTestDataBuilder.from().withDefaultData().build();

  describe('Add Event', () => {
    it('should create Add Event Request action', () => {
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];
      expect(calendarActions.event.addEventRequest({ event })).toEqual({
        type: '[New Event Dialog] Add Event Request',
        event
      });
    });

    it('should create Add Event Success action', () => {
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];
      expect(calendarActions.event.addEventSuccess({ event })).toEqual({
        type: '[Database API] Add Event Success',
        event
      });
    });

    it('should create Add Event Failure action', () => {
      expect(calendarActions.event.addEventFailure({ error })).toEqual({
        type: '[Database API] Add Event Failure',
        error
      });
    });
  });

  describe('Update Event', () => {
    it('should create Update Event Request action', () => {
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];
      expect(calendarActions.event.updateEventRequest({ event })).toEqual({
        type: '[Update Event Dialog] Update Event Request',
        event
      });
    });

    it('should create Update Event Success action', () => {
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];
      const eventUpdate: Update<Event> = {
        changes: event,
        id: event.id
      };

      expect(calendarActions.event.updateEventSuccess({ eventUpdate })).toEqual({
        type: '[Database API] Update Event Success',
        eventUpdate
      });
    });

    it('should create Update Event Error action', () => {
      expect(calendarActions.event.updateEventFailure({ error })).toEqual({
        type: '[Database API] Update Event Failure',
        error
      });
    });
  });

  describe('Delete Event', () => {
    it('should create Delete Event Request action', () => {
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];
      expect(calendarActions.event.deleteEventRequest({ id: event.id })).toEqual({
        type: '[Update Event Dialog] Delete Event Request',
        id: event.id
      });
    });

    it('should create Delete Event Success action', () => {
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];
      expect(calendarActions.event.deleteEventSuccess({ id: event.id })).toEqual({
        type: '[Database API] Delete Event Success',
        id: event.id
      });
    });

    it('should create Delete Event Failure action', () => {
      expect(calendarActions.event.deleteEventFailure({ error })).toEqual({
        type: '[Database API] Delete Event Failure',
        error
      });
    });
  });
});
