import { calendarEventActions } from 'src/app/modules/calendar/store/actions/event/calendar-event.actions';
import { calendarEventsActions } from 'src/app/modules/calendar/store/actions/events/calendar-events.actions';
import { calendarUiActions } from 'src/app/modules/calendar/store/actions/ui/calendar-ui.actions';

export const calendarActions = {
  ui: calendarUiActions,
  events: calendarEventsActions,
  event: calendarEventActions
};
