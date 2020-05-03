import { createAction, props } from '@ngrx/store';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view/adona-calendar-view.model';

const types = {
  viewChange: '[Calendar Page] View Change',
  viewDateChange: '[Calendar Page] View Date Change'
};

const viewChange = createAction(types.viewChange, props<{ view: AdonaCalendarView }>());
const viewDateChange = createAction(types.viewDateChange, props<{ date: Date }>());

export const calendarUiActions = {
  viewChange,
  viewDateChange
};
