import { DialogAction } from '../../enum/dialog-action.enum';

export interface DialogResult<T> {
  action?: DialogAction;
  payload?: T;
}
